import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  NgApexchartsModule
} from 'ng-apexcharts';
import { AuthService } from '../../core/service/auth.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBagShopping, faCommentDollar, faDollar, faDollarSign, faFileInvoiceDollar, faFunnelDollar, faHandHoldingDollar, faMagnifyingGlassDollar, faMoneyCheckDollar, faNewspaper, faPersonCircleCheck, faSearchDollar, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { NgxLoadingModule } from 'ngx-loading';
import { DashboardService } from '../../core/service/dashboard.service';

export type salesChartOptions = {
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
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [AuthService, DashboardService],
  imports: [NgxLoadingModule, NgApexchartsModule, NgxDatatableModule, FontAwesomeModule],
  standalone: true
})
export class SalesComponent implements AfterViewInit {

  /*Font awesome icons*/
  faPersonCircleCheck = faPersonCircleCheck;
  faNewspaper = faNewspaper;
  faUsers = faUsers;
  faUser = faUser;
  faBagShopping = faBagShopping;
  faDollar = faDollar;

  totalUsuarios: number = 0;
  totalProyectos: number = 0;
  totalSuscripciones: number = 0;
  totalNoticias: number = 0;
  totalCampanas: number = 0;
  totalFormaciones: number = 0;

  totalValorPedidos: number = 0;
  loading: boolean = true;

  meses: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  public salesChartOptions: Partial<salesChartOptions>;



  constructor(private router: Router, private dashboardService: DashboardService, public authService: AuthService) {

    this.salesChartOptions = {
      series: [
        {
          name: 'Proyectos',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Noticias',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Campañas',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Formaciones',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Alianzas',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Suscripciones',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }

      ],
      chart: {
        fontFamily: 'Nunito Sans,sans-serif',
        height: 250,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 3,
        strokeColors: 'transparent',
      },
      stroke: {
        curve: 'smooth',
        width: '2',
      },
      //colors: ['#2962ff', '#4fc3f7'],
      legend: {
        show: false,
      },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: 'category',
        categories: this.meses,
        labels: {
          style: {
            colors: '#a1aab2'
          }
        }
      },
      tooltip: {
        theme: 'dark'
      }
    };






  }

  ngAfterViewInit(): void {

    this.dashboardService.getDashboardStats().subscribe((response) => {
      this.totalUsuarios = response.totalUsuarios;
      this.totalProyectos = response.totalProyectos;
      this.totalNoticias = response.totalNoticias;
      this.totalCampanas = response.totalCampanas;
      this.totalSuscripciones = response.totalSuscripcion;
      this.totalFormaciones = response.totalFormacion;

      const ordenMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      // Ordenar los meses de la respuesta
      const mesesOrdenados = ordenMeses.filter(m => response.meses.includes(m));

      // Función para reordenar arrays de datos según el orden de meses
      const ordenarDatos = (originalArray: number[], originalMeses: string[]): number[] => {
        return mesesOrdenados.map(m => {
          const idx = originalMeses.indexOf(m);
          return idx !== -1 ? originalArray[idx] : 0;
        });
      };

      // Reordenar los datos
      const proyectoMeses = ordenarDatos(response.proyectoMeses, response.meses);
      const noticiasMeses = ordenarDatos(response.noticiasMeses, response.meses);
      const campanasMeses = ordenarDatos(response.campanasMeses, response.meses);
      const formacionesMeses = ordenarDatos(response.formacionesMeses, response.meses);
      const alianzasMeses = ordenarDatos(response.alianzasMeses, response.meses);
      const suscripcionesMeses = ordenarDatos(response.suscripcionesMeses, response.meses);

      this.meses = mesesOrdenados;

      this.salesChartOptions = {
        series: [
          { name: 'Proyectos', data: proyectoMeses },
          { name: 'Noticias', data: noticiasMeses },
          { name: 'Campañas', data: campanasMeses },
          { name: 'Formaciones', data: formacionesMeses },
          { name: 'Alianzas', data: alianzasMeses },
          { name: 'Suscripciones', data: suscripcionesMeses },
        ],
        chart: {
          fontFamily: 'Nunito Sans,sans-serif',
          height: 250,
          type: 'area',
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
          size: 3,
          strokeColors: 'transparent',
        },
        stroke: {
          curve: 'smooth',
          width: '2',
        },
        legend: {
          show: true,
        },
        grid: {
          show: true,
          strokeDashArray: 0,
          borderColor: 'rgba(0,0,0,0.1)',
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        xaxis: {
          type: 'category',
          categories: this.meses,
          labels: {
            style: {
              colors: '#a1aab2'
            }
          }
        },
        tooltip: {
          theme: 'light'
        }
      };

      this.loading = false;
    });



  }


}
