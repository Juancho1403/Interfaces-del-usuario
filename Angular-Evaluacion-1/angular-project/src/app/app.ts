import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBar } from './top-bar/top-bar';
import { Form } from './form/form'
import { FormFull } from './form-full/form-full';
import { StylesTest } from './styles-test/styles-test';
import { Header } from './header/header';
import { HomePage } from './home-page/home-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar, Header, HomePage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular-project';
}
