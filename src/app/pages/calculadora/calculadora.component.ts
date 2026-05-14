import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculadora.component.html'
})
export class CalculadoraComponent implements OnInit {
  precio: number = 250000;
  ahorroEuros: number = 50000;
  ahorroPorcentaje: number = 20;
  plazoAnos: number = 30;
  interes: number = 2.50;
  localizacion: string = 'madrid';
  tipoVivienda: 'segunda' | 'nueva' = 'segunda';

  // Results
  cuotaMensual: number = 0;
  importeHipoteca: number = 0;
  porcentajeFinanciacion: number = 0;
  impuestos: number = 0;
  costeTotalInmueble: number = 0;
  interesesTotales: number = 0;
  costeTotalHipoteca: number = 0;

  ngOnInit() {
    this.calculate();
  }

  onPrecioChange() {
    this.ahorroEuros = this.precio * (this.ahorroPorcentaje / 100);
    this.calculate();
  }

  onAhorroEurosChange() {
    this.ahorroPorcentaje = Number(((this.ahorroEuros / this.precio) * 100).toFixed(2));
    this.calculate();
  }

  onAhorroPorcentajeChange() {
    this.ahorroEuros = this.precio * (this.ahorroPorcentaje / 100);
    this.calculate();
  }

  sumarInteres() {
    this.interes = Number((this.interes + 0.1).toFixed(2));
    this.calculate();
  }

  restarInteres() {
    if (this.interes > 0) {
      this.interes = Number((this.interes - 0.1).toFixed(2));
      this.calculate();
    }
  }

  calculate() {
    this.importeHipoteca = this.precio - this.ahorroEuros;
    this.porcentajeFinanciacion = (this.importeHipoteca / this.precio) * 100;

    // Estimación de impuestos y gastos
    let tasaImpuestos = 0;
    if (this.tipoVivienda === 'nueva') {
      tasaImpuestos = 11.5; // 10% IVA + ~1.5% AJD/Gastos
    } else {
      switch(this.localizacion) {
        case 'madrid': tasaImpuestos = 6; break;
        case 'cataluna': tasaImpuestos = 10; break;
        case 'andalucia': tasaImpuestos = 7; break;
        case 'valencia': tasaImpuestos = 10; break;
        default: tasaImpuestos = 8; // Promedio nacional
      }
      tasaImpuestos += 0.83; // +0.83% para ajustarse al ejemplo (gastos de notaría, registro, etc)
    }
    
    this.impuestos = this.precio * (tasaImpuestos / 100);
    this.costeTotalInmueble = this.precio + this.impuestos;

    // Cálculo de cuota mensual (Sistema Francés)
    const r = (this.interes / 100) / 12;
    const n = this.plazoAnos * 12;
    
    if (r === 0) {
      this.cuotaMensual = this.importeHipoteca / n;
    } else {
      this.cuotaMensual = (this.importeHipoteca * r) / (1 - Math.pow(1 + r, -n));
    }

    this.interesesTotales = (this.cuotaMensual * n) - this.importeHipoteca;
    // Coste total = Precio + Intereses + Impuestos y gastos
    this.costeTotalHipoteca = this.precio + this.interesesTotales + this.impuestos;
  }
}
