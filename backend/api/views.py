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

        # --- Colors ---
        TEAL_DARK = (0.05, 0.58, 0.53) # #0d9488
        TEAL_LIGHT = (0.94, 0.99, 0.98) # #f0fdfa
        GRAY_TEXT = (0.2, 0.2, 0.2)
        GRAY_LINE = (0.8, 0.8, 0.8)

        # --- HEADER ---
        p.setFillColorRGB(*TEAL_DARK)
        p.rect(0, height - 100, width, 100, fill=1, stroke=0)
        
        p.setFont("Helvetica-Bold", 24)
        p.setFillColorRGB(1, 1, 1)
        p.drawString(40, height - 55, "ChemViz Analytical Report")
        
        from datetime import datetime
        p.setFont("Helvetica", 10)
        p.setFillColorRGB(0.9, 0.9, 0.9)
        p.drawString(40, height - 75, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')} | Dataset ID: {id}")
        
        # --- SUMMARY STATISTICS ---
        records = EquipmentRecord.objects.filter(dataset_id=id)
        total = records.count()
        
        if total > 0:
            avg_flow = records.aggregate(Avg('flowrate'))['flowrate__avg']
            avg_press = records.aggregate(Avg('pressure'))['pressure__avg']
            avg_temp = records.aggregate(Avg('temperature'))['temperature__avg']
            
            y_pos = height - 150
            
            p.setFont("Helvetica-Bold", 14)
            p.setFillColorRGB(*GRAY_TEXT)
            p.drawString(40, y_pos, "Executive Summary")
            
            # Stat Cards
            card_y = y_pos - 60
            card_width = 110
            card_height = 50
            gap = 20
            
            def draw_stat_box(x, title, value, unit):
                p.setStrokeColorRGB(*GRAY_LINE)
                p.setFillColorRGB(1, 1, 1)
                p.roundRect(x, card_y, card_width, card_height, 5, fill=1, stroke=1)
                p.setFont("Helvetica", 9)
                p.setFillColorRGB(0.5, 0.5, 0.5)
                p.drawString(x + 10, card_y + 32, title)
                p.setFont("Helvetica-Bold", 14)
                p.setFillColorRGB(*TEAL_DARK)
                p.drawString(x + 10, card_y + 12, f"{value}")
                p.setFont("Helvetica", 8)
                p.setFillColorRGB(0.6, 0.6, 0.6)
                p.drawRightString(x + card_width - 10, card_y + 14, unit)

            draw_stat_box(40, "Total Records", str(total), "")
            draw_stat_box(40 + card_width + gap, "Avg Flowrate", f"{avg_flow:.1f}", "L/min")
            draw_stat_box(40 + 2*(card_width + gap), "Avg Pressure", f"{avg_press:.1f}", "PSI")
            draw_stat_box(40 + 3*(card_width + gap), "Avg Temp", f"{avg_temp:.1f}", "°C")

            # --- GRAPHS SECTION ---
            # Prepare Data
            df = pd.DataFrame(list(records.values('flowrate', 'pressure', 'equipment_type')))
            
            graph_y = card_y - 220 
            
            # 1. Trend Plot
            plt.figure(figsize=(6, 3))
            plt.plot(df.index, df['flowrate'], label='Flowrate', color='#0d9488', linewidth=1)
            plt.plot(df.index, df['pressure'], label='Pressure', color='#f59e0b', linestyle='--', linewidth=1)
            plt.title('Process Trends', fontsize=10)
            plt.legend(fontsize=8)
            plt.grid(True, linestyle=':', alpha=0.6)
            plt.tight_layout()
            
            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format='png', dpi=100)
            img_buffer.seek(0)
            p.drawImage(ImageReader(img_buffer), 40, graph_y, width=300, height=180)
            plt.close()

            # 2. Distribution Plot
            plt.figure(figsize=(4, 3))
            counts = df['equipment_type'].value_counts()
            colors = ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4']
            plt.pie(counts, labels=counts.index, autopct='%1.1f%%', colors=colors[:len(counts)], textprops={'fontsize': 8})
            plt.title('Equipment Distribution', fontsize=10)
            plt.tight_layout()
            
            img_buffer2 = io.BytesIO()
            plt.savefig(img_buffer2, format='png', dpi=100)
            img_buffer2.seek(0)
            p.drawImage(ImageReader(img_buffer2), 360, graph_y, width=200, height=180)
            plt.close()

            # --- DATA TABLE ---
            y = graph_y - 40
            p.setFont("Helvetica-Bold", 14)
            p.setFillColorRGB(*GRAY_TEXT)
            p.drawString(40, y, "Detailed Equipment Log")
            
            y -= 30
            
            # Table Header
            p.setFillColorRGB(*TEAL_DARK)
            p.rect(40, y - 5, 515, 20, fill=1, stroke=0)
            p.setFont("Helvetica-Bold", 9)
            p.setFillColorRGB(1, 1, 1)
            p.drawString(50, y, "Equipment Name")
            p.drawString(220, y, "Type")
            p.drawString(320, y, "Flowrate")
            p.drawString(410, y, "Pressure")
            p.drawString(500, y, "Temp")
            
            y -= 25
            p.setFont("Helvetica", 9)
            p.setFillColorRGB(*GRAY_TEXT)
            
            for index, record in enumerate(records):
                if y < 50:
                    p.showPage()
                    y = height - 50
                
                if index % 2 == 1:
                    p.setFillColorRGB(*TEAL_LIGHT)
                    p.rect(40, y - 5, 515, 15, fill=1, stroke=0)
                    p.setFillColorRGB(*GRAY_TEXT)

                p.drawString(50, y, str(record.equipment_name)[:25])
                p.drawString(220, y, str(record.equipment_type))
                p.drawString(320, y, f"{record.flowrate:.1f}")
                p.drawString(410, y, f"{record.pressure:.1f}")
                p.drawString(500, y, f"{record.temperature:.1f}")
                
                y -= 18

        else:
            p.setFont("Helvetica", 12)
            p.drawString(40, height - 150, "No data records found in this dataset.")

        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
