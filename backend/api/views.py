from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Avg, Count
from django.http import HttpResponse

from .models import Dataset, EquipmentRecord
from .serializers import DatasetSerializer, EquipmentRecordSerializer

import pandas as pd
from reportlab.pdfgen import canvas
import io

class DatasetUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_serializer = DatasetSerializer(data=request.data)
        if file_serializer.is_valid():
            # Attach user
            dataset = file_serializer.save(user=request.user)
            
            
            # Process CSV
            try:
                df = pd.read_csv(dataset.file.path)
                # Expected columns: "Equipment Name,Type,Flowrate,Pressure,Temperature"
                
                records = []
                for _, row in df.iterrows():
                    records.append(EquipmentRecord(
                        dataset=dataset,
                        equipment_name=row['Equipment Name'],
                        equipment_type=row['Type'],
                        flowrate=row['Flowrate'],
                        pressure=row['Pressure'],
                        temperature=row['Temperature']
                    ))
                EquipmentRecord.objects.bulk_create(records)
                
                return Response(file_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                dataset.delete()
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DatasetListView(generics.ListAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Dataset.objects.filter(user=self.request.user).order_by('-uploaded_at')

class GlobalDatasetListView(generics.ListAPIView):
    queryset = Dataset.objects.all().order_by('-uploaded_at')
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated]

class DatasetRecordsView(generics.ListAPIView):
    serializer_class = EquipmentRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        dataset_id = self.kwargs['id']
        return EquipmentRecord.objects.filter(dataset_id=dataset_id)

class DatasetStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        records = EquipmentRecord.objects.filter(dataset_id=id)
        if not records.exists():
             return Response({"error": "Dataset not found or empty"}, status=404)
        
        total_count = records.count()
        avg_flow = records.aggregate(Avg('flowrate'))['flowrate__avg']
        avg_press = records.aggregate(Avg('pressure'))['pressure__avg']
        avg_temp = records.aggregate(Avg('temperature'))['temperature__avg']
        
        type_dist = records.values('equipment_type').annotate(count=Count('equipment_type'))
        dist_dict = {item['equipment_type']: item['count'] for item in type_dist}
        
        return Response({
            "total_count": total_count,
            "average_flowrate": avg_flow,
            "average_pressure": avg_press,
            "average_temperature": avg_temp,
            "type_distribution": dist_dict
        })

from reportlab.lib.utils import ImageReader
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

class DatasetPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        width, height = 595.27, 841.89 # A4 Size

        # --- COLORS & FONTS ---
        TEAL_MAIN = (0.05, 0.58, 0.53) # #0d9488
        TEAL_DARK = (0.0, 0.3, 0.28) 
        TEAL_LIGHT = (0.94, 0.99, 0.98) # #f0fdfa
        GRAY_TEXT = (0.2, 0.2, 0.2)
        GRAY_SUB = (0.5, 0.5, 0.5)
        GRAY_LINE = (0.9, 0.9, 0.9)
        
        # --- HEADER ---
        # Draw top banner
        p.setFillColorRGB(*TEAL_MAIN)
        p.rect(0, height - 80, width, 80, fill=1, stroke=0)
        
        # Logo placeholder (Text for now)
        p.setFont("Helvetica-Bold", 28)
        p.setFillColorRGB(1, 1, 1)
        p.drawString(40, height - 50, "ChemViz")
        
        p.setFont("Helvetica", 12)
        p.drawString(40, height - 68, "Advanced Chemical Process Analytics")

        # Report Info (Right aligned)
        from datetime import datetime
        p.setFont("Helvetica-Bold", 14)
        p.drawRightString(width - 40, height - 45, "ANALYTICAL REPORT")
        
        p.setFont("Helvetica", 9)
        p.drawRightString(width - 40, height - 62, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        p.drawRightString(width - 40, height - 74, f"Dataset ID: #{id}")

        # --- FOOTER HELPER ---
        def draw_footer(canvas, page_num):
            canvas.saveState()
            canvas.setStrokeColorRGB(*GRAY_LINE)
            canvas.line(40, 40, width - 40, 40)
            canvas.setFont("Helvetica", 8)
            canvas.setFillColorRGB(*GRAY_SUB)
            canvas.drawString(40, 25, "ChemViz Analytics Platform • Confidential Report")
            canvas.drawRightString(width - 40, 25, f"Page {page_num}")
            canvas.restoreState()

        # --- CONTENT ---
        records = EquipmentRecord.objects.filter(dataset_id=id)
        total = records.count()
        
        if total > 0:
            avg_flow = records.aggregate(Avg('flowrate'))['flowrate__avg']
            avg_press = records.aggregate(Avg('pressure'))['pressure__avg']
            avg_temp = records.aggregate(Avg('temperature'))['temperature__avg']
            
            y_pos = height - 120
            
            # Title Section
            p.setFont("Helvetica-Bold", 16)
            p.setFillColorRGB(*GRAY_TEXT)
            p.drawString(40, y_pos, "Executive Summary")
            y_pos -= 10
            
            # --- KPI CARDS ---
            card_y = y_pos - 70
            card_width = 120
            card_height = 60
            gap = 15
            
            def draw_stat_box(x, title, value, unit, icon_color=(0.9, 0.9, 0.9)):
                # Shadow effect
                p.setFillColorRGB(0.95, 0.95, 0.95)
                p.roundRect(x+2, card_y-2, card_width, card_height, 6, fill=1, stroke=0)
                # Main box
                p.setFillColorRGB(1, 1, 1)
                p.setStrokeColorRGB(0.9, 0.9, 0.9)
                p.roundRect(x, card_y, card_width, card_height, 6, fill=1, stroke=1)
                
                # Title
                p.setFont("Helvetica", 9)
                p.setFillColorRGB(*GRAY_SUB)
                p.drawString(x + 12, card_y + 42, title)
                
                # Value
                p.setFont("Helvetica-Bold", 18)
                p.setFillColorRGB(*TEAL_MAIN)
                p.drawString(x + 12, card_y + 18, str(value))
                
                # Unit
                if unit:
                    p.setFont("Helvetica-Bold", 9)
                    p.setFillColorRGB(*GRAY_SUB)
                    p.drawRightString(x + card_width - 12, card_y + 20, unit)

            draw_stat_box(40, "Total Records", str(total), "")
            draw_stat_box(40 + card_width + gap, "Avg Flowrate", f"{avg_flow:.1f}", "L/min")
            draw_stat_box(40 + 2*(card_width + gap), "Avg Pressure", f"{avg_press:.1f}", "PSI")
            draw_stat_box(40 + 3*(card_width + gap), "Avg Temp", f"{avg_temp:.1f}", "°C")

            # --- GRAPHS ---
            y_pos = card_y - 30
            
            df = pd.DataFrame(list(records.values('flowrate', 'pressure', 'temperature', 'equipment_type')))
            
            # Matplotlib Aesthetic Setup
            plt.style.use('seaborn-v0_8-whitegrid')
            
            # 1. Trend Chart
            fig, ax = plt.subplots(figsize=(8, 3.5))
            ax.plot(df.index, df['flowrate'], label='Flowrate', color='#0d9488', linewidth=1.5, alpha=0.9)
            ax.fill_between(df.index, df['flowrate'], color='#0d9488', alpha=0.1)
            ax.plot(df.index, df['pressure'], label='Pressure', color='#f59e0b', linestyle='--', linewidth=1.5)
            
            ax.set_title('Process Trends Overview', fontsize=12, pad=10, fontweight='bold', color='#333333')
            ax.legend(frameon=True, fontsize=9)
            ax.set_ylabel('Value', fontsize=9)
            ax.tick_params(axis='both', which='major', labelsize=8)
            ax.margins(x=0)
            
            for spine in ax.spines.values():
                spine.set_visible(False)
            
            plt.tight_layout()
            
            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
            img_buffer.seek(0)
            
            graph_height = 180
            p.drawImage(ImageReader(img_buffer), 35, y_pos - graph_height, width=520, height=graph_height)
            plt.close()
            
            y_pos -= (graph_height + 30)

            # 2. Side-by-Side: Distribution + Bar
            # Distribution
            fig2, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 3.5))
            
            counts = df['equipment_type'].value_counts()
            colors = ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4']
            ax1.pie(counts, labels=counts.index, autopct='%1.1f%%', colors=colors[:len(counts)], 
                   textprops={'fontsize': 8}, startangle=90, pctdistance=0.85)
            # Draw circle for donut chart
            centre_circle = plt.Circle((0,0),0.70,fc='white')
            ax1.add_artist(centre_circle)
            ax1.set_title('Equipment Distribution', fontsize=10, fontweight='bold')
            
            # Bar Chart (Avg Flow per Type)
            avg_by_type = df.groupby('equipment_type')['flowrate'].mean()
            ax2.bar(avg_by_type.index, avg_by_type.values, color='#0d9488', alpha=0.8, width=0.6)
            ax2.set_title('Avg Flowrate by Type', fontsize=10, fontweight='bold')
            ax2.tick_params(axis='x', rotation=45, labelsize=8)
            ax2.grid(axis='y', linestyle='--', alpha=0.5)
            for spine in ax2.spines.values():
                spine.set_visible(False)
            
            plt.tight_layout()
            img_buffer2 = io.BytesIO()
            plt.savefig(img_buffer2, format='png', dpi=150, bbox_inches='tight')
            img_buffer2.seek(0)
            
            graph_height_2 = 160
            p.drawImage(ImageReader(img_buffer2), 35, y_pos - graph_height_2, width=520, height=graph_height_2)
            plt.close()

            draw_footer(p, 1)
            p.showPage()
            
            # --- PAGE 2: TABLE ---
            # Header on new page
            p.setFillColorRGB(*TEAL_MAIN)
            p.rect(0, height - 60, width, 60, fill=1, stroke=0)
            p.setFont("Helvetica-Bold", 18)
            p.setFillColorRGB(1, 1, 1)
            p.drawString(40, height - 40, "Detailed Equipment Logs")
            
            y = height - 100
            
            # Table Schema
            cols = [
                {"name": "Equipment Name", "x": 40, "w": 180},
                {"name": "Type", "x": 220, "w": 100},
                {"name": "Flow (L/min)", "x": 320, "w": 80},
                {"name": "Press (PSI)", "x": 400, "w": 80},
                {"name": "Temp (°C)", "x": 480, "w": 80},
            ]
            
            # Draw Header Row
            p.setFillColorRGB(*TEAL_MAIN)
            p.roundRect(40, y-5, 515, 25, 4, fill=1, stroke=0)
            p.setFillColorRGB(1, 1, 1)
            p.setFont("Helvetica-Bold", 9)
            
            for col in cols:
                p.drawString(col["x"] + 10, y + 2, col["name"])
            
            y -= 25
            page_num = 2
            
            p.setFont("Helvetica", 9)
            p.setFillColorRGB(*GRAY_TEXT)
            
            for index, record in enumerate(records):
                if y < 60:
                    draw_footer(p, page_num)
                    p.showPage()
                    page_num += 1
                    
                    # Re-draw header on new page
                    p.setFillColorRGB(*TEAL_MAIN)
                    p.rect(0, height - 40, width, 40, fill=1, stroke=0)
                    p.setFont("Helvetica-Bold", 14)
                    p.setFillColorRGB(1, 1, 1)
                    p.drawString(40, height - 28, "Detailed Equipment Logs (Cont.)")
                    
                    y = height - 80
                    p.setFillColorRGB(*TEAL_MAIN)
                    p.roundRect(40, y-5, 515, 25, 4, fill=1, stroke=0)
                    p.setFillColorRGB(1, 1, 1)
                    p.setFont("Helvetica-Bold", 9)
                    for col in cols:
                        p.drawString(col["x"] + 10, y + 2, col["name"])
                    y -= 25
                    p.setFont("Helvetica", 9)

                # Row Background
                if index % 2 == 0:
                    p.setFillColorRGB(*TEAL_LIGHT)
                    p.rect(40, y - 6, 515, 18, fill=1, stroke=0)
                
                # Cell Content
                p.setFillColorRGB(*GRAY_TEXT)
                p.drawString(cols[0]["x"] + 10, y, str(record.equipment_name)[:28])
                p.drawString(cols[1]["x"] + 10, y, str(record.equipment_type))
                p.drawString(cols[2]["x"] + 10, y, f"{record.flowrate:.1f}")
                p.drawString(cols[3]["x"] + 10, y, f"{record.pressure:.1f}")
                
                # Conditional color for Temp
                if record.temperature > 100:
                    p.setFillColorRGB(0.8, 0.2, 0.2)
                    p.setFont("Helvetica-Bold", 9)
                p.drawString(cols[4]["x"] + 10, y, f"{record.temperature:.1f}")
                
                if record.temperature > 100:
                    p.setFillColorRGB(*GRAY_TEXT)
                    p.setFont("Helvetica", 9)

                y -= 20
                
            draw_footer(p, page_num)

        else:
            p.setFont("Helvetica", 12)
            p.drawString(40, height - 150, "No data records found in this dataset.")

        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
