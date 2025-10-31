import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import * as c3 from 'c3';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexTheme,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  NgApexchartsModule
} from 'ng-apexcharts';

import { AuthService } from '../../core/service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faNewspaper, faPersonCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../core/service/dashboard.service';

export type realdataChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
};

@Component({
  selector: 'app-realdata',
  templateUrl: './realdata.component.html',
  styleUrls: ['./realdata.component.css'],
  standalone: true,
  imports: [NgApexchartsModule, NgxDatatableModule, FontAwesomeModule],
  providers: [DashboardService, AuthService]
})
export class RealdataComponent implements AfterViewInit {
  /*Font awesome icons*/
  faPersonCircleCheck = faPersonCircleCheck;
  faNewspaper = faNewspaper;

  @ViewChild("chart") chart2: ChartComponent = Object.create(null);
  public realdataChartOptions: any;

  constructor(private dashboardService: DashboardService) {

    this.realdataChartOptions = {
      series: [
        {
          name: 'Site A',
          data: []
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        fontFamily: 'Nunito Sans,sans-serif',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      stroke: {
        curve: 'smooth',
        width: '1',
      },
      colors: ['#2961ff', '#ff821c'],
      legend: {
        show: false,
      },
      grid: {
        show: true
      },
      xaxis: {
        labels: {
          show: true
        }
      },
      yaxis: {
        labels: {
          show: true
        }
      },
      tooltip: {
        theme: 'dark'
      }
    };
  }


  totalTestimonios: number = 0;
  totalNoticias: number = 0;
  testimonioMeses: number = 0;
  noticiaMeses: number = 0;

  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  ngAfterViewInit() {
    this.dashboardService.getDashboardStats().subscribe((response) => {

      this.totalNoticias = response.totalNoticias;
      this.totalTestimonios = response.totalTestimonios;

      this.meses = response.meses;
      this.realdataChartOptions = {
        series: [
          {
            name: 'Eventos',
            data: response.noticiaMeses

          },
          {
            name: 'Testimonios',
            data: response.testimonioMeses

          },
        ],
        chart: {
          height: 350,
          type: 'area',
          fontFamily: 'Nunito Sans,sans-serif',
          toolbar: {
            show: true,
            tools: {
              download: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'smooth',
          width: '2',
        },
        colors: ['#008FFB', '#1010BD', '#008000'],
        legend: {
          show: true,
        },
        grid: {
          show: true
        },
        xaxis: {
          type: 'category',
          categories: this.meses,
          labels: {
            show: true
          },
        },
        yaxis: {
          labels: {
            show: true
          }
        },
        tooltip: {
          theme: 'dark'
        }
      };
    });
  }
}
