import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit {
    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];
    isClicked: boolean = true;
    
    ngOnInit(): void {
        //this.getMenuMode();
    }

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) { }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config().scale;
    }
    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
        //alert("sacel: "+_val);
        this.updateConfig('scale', _val);
    }
    
    get menuMode(): string {        
        return this.layoutService.config().menuMode;        
    }

    set menuMode(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
        this.updateConfig('menuMode', _val);
    }
    private updateConfig(colName: string, colValue): void {
        this.layoutService
            .saveConfig(colName, colValue)
            .subscribe((response) => { });
           // alert(colName+" : "+colValue);
    }

    get inputStyle(): string {
        return this.layoutService.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this.layoutService.config().inputStyle = _val;
        this.updateConfig('inputStyle', _val);
    }

    get ripple(): boolean {
        return this.layoutService.config().ripple;
    }
    set ripple(_val: boolean) {
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
        this.updateConfig('ripple', _val);
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
        this.updateConfig('theme', val);
    }
    get theme(): string {
        return this.layoutService.config().theme;
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
        this.updateConfig('colorScheme', val);
    }
    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = colorScheme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
}
