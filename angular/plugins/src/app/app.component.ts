import { Component, Compiler, ViewChild, ViewContainerRef, AfterViewInit, NgModule, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { PluginsModule } from './plugins.module';
import { SettingsComponent } from './settings/settings.component';
import { BrowserModule } from '@angular/platform-browser';

import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';

import { System } from 'systemjs';
declare var SystemJS: System;

declare var require: any;
declare var define: any;

interface PluginsConfig {
  system: any;
  plugins: {
    modules: any,
    routes: Array<{
      name: string,
      path: string,
      component: {
        module: string,
        componentType: string
      }
    }>
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('content', { read: ViewContainerRef })
  content: ViewContainerRef;

  private module;

  links: { text: string, path: string }[] = [];

  constructor(private compiler: Compiler,
              private router: Router,
              private http: HttpClient,
              private injector: Injector,
              private fb: FormBuilder) {
    this.module = this.compiler.compileModuleAndAllComponentsSync(PluginsModule);
    this.createRoute('Settings', 'settings', SettingsComponent);
    console.log(fb);
  }

  async ngAfterViewInit() {
    const url = '/assets/plugins.config.json';
    const config = <PluginsConfig> await this.http.get(url).toPromise();
    console.log(config);

    SystemJS.config(config.system);
    const baseUrl = SystemJS.baseURL;

    // console.log(require.cache);
    /*
    require.ensure(['@angular/core' + ''], (r) => {
      var m = r('')
      console.log(r);
    });
    */

    // console.log(require('@angular/core' + ''));

    SystemJS.set('mytranspiler.js', SystemJS.newModule({
      fetch(loadData) {
        // if (loadData.name === 'http://localhost:4200/assets/modules/@angular/core') {
        console.log('FETCH', loadData);
        return '';
        // }
      },
      translate(loadData) {
        // if (loadData.name === 'http://localhost:4200/assets/modules/@angular/core') {
        console.log('TRANSLATE', loadData);
        return '';
        // }
      },
      instantiate(loadData) {
        console.log('INSTANTIATE', loadData);


        const name = loadData.name.replace(baseUrl, '');
        // return import(name);

        /*
        require.ensure([name], (r) => {
          r(name);
        });
        */

        if (loadData.name === 'http://localhost:4200/assets/modules/@angular/core') {
          console.log('resolve @angular/core');
          return import('@angular/core');
        }

        if (loadData.name === 'http://localhost:4200/assets/modules/@angular/common') {
          console.log('resolve @angular/common');
          return import('@angular/common');
        }

        if (loadData.name === 'http://localhost:4200/assets/modules/@angular/forms') {
          console.log('resolve @angular/forms');
          return import('@angular/forms');
        }

        if (loadData.name === 'http://localhost:4200/assets/modules/@angular/platform-browser') {
          console.log('resolve @angular/platform-browser');
          return import('@angular/platform-browser');
        }

        return null;
      }
    }));




    this.loadExternalRoutes(config);

    const ngCore = await import('@angular/core');
    const ngCommon = await import('@angular/common');
    // SystemJS.set('@angular/core', SystemJS.newModule(ngCore));
    // SystemJS.set('@angular/common', SystemJS.newModule(ngCommon));

    const core = await SystemJS.import('plugins-core');
    const pluginExample = await SystemJS.import('plugins-example');
    // http://localhost:4200/modules/plugins-core/bundle.js
    console.log(core);

    const componentType = core.pluginManager.getType('my-label');

    const RuntimeModule = NgModule({
      // option 1
      // imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
      providers: [
        // option 2
        // { provide: Injector, useValue: this.injector },
        // { provide: FormBuilder, useValue: this.fb }
      ],
      declarations: [
        componentType
      ]
    })(class {});

    const module = this.compiler.compileModuleAndAllComponentsSync(RuntimeModule);
    const factory = module.componentFactories.find(f => f.componentType === componentType);

    const pluginInjector = Injector.create([
      ...core.pluginManager.getProviders(),
    ], this.injector);

    this.content.clear();
    const componentRef = this.content.createComponent(factory, 0, pluginInjector);
    console.log(componentRef.instance.form);
  }

  createView(name: string) {
    const factory = this.module.componentFactories.find(f => f.selector === name);

    this.content.clear();
    this.content.createComponent(factory);
  }

  private async loadExternalRoutes(config: PluginsConfig) {
    const core = await SystemJS.import('plugins-core');

    for (const route of config.plugins.routes) {
      const module = await SystemJS.import(route.component.module);
      const componentType = core.pluginManager.getType(route.component.componentType);
      this.createRoute(route.name, route.path, DynamicPageComponent, componentType);
    }
  }

  createRoute(text: string, path: string, componentType: any, factoryType?: any) {
    this.router.config.unshift({
      path: path,
      component: componentType,
      data: {
        factory: factoryType
      }
    });

    this.links.push({ text, path });
  }
}
