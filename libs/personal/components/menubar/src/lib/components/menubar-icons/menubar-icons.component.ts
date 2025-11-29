import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BatteryComponent } from '@po/personal/components/battery';
import { IconComponent } from '@po/personal/components/icon';

@Component({
  selector: 'ps-menubar-icons',
  templateUrl: 'menubar-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    BatteryComponent,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    NgClass,
  ],
})
export class MenuBarIconsComponent {
  protected readonly isBluetoothMenuOpen = signal(false);
  protected readonly isWifiMenuOpen = signal(false);

  protected readonly bluetoothDevices = [
    {
      name: 'Nokia 3310',
      batteryLevel: 101,
    },
    { name: 'Soviet-Era Microwave', batteryLevel: 87 },
  ];

  protected readonly wifiNetworks = [
    { name: 'FBI Surveillance Van #3', signalStrength: 100, locked: true },
    { name: 'Neighbor with the drill', signalStrength: 45, locked: true },
    { name: 'ItHurtsWhenIP', signalStrength: 33, locked: true },
    { name: 'Loading...', signalStrength: 15, locked: true },
  ];

  protected getBatteryColor(level: number): string {
    if (level <= 20) return 'text-primary-red';
    if (level <= 50) return 'text-primary-orange';
    return 'text-accent-green';
  }

  protected toggleBluetoothMenu(): void {
    this.isBluetoothMenuOpen.update((open) => !open);
  }

  protected closeBluetoothMenu(): void {
    this.isBluetoothMenuOpen.set(false);
  }

  protected connectDevice(deviceName: string): void {
    console.log(`Attempting to connect to ${deviceName}...`);
    this.closeBluetoothMenu();
  }

  protected toggleWifiMenu(): void {
    this.isWifiMenuOpen.update((open) => !open);
  }

  protected closeWifiMenu(): void {
    this.isWifiMenuOpen.set(false);
  }

  protected connectNetwork(networkName: string): void {
    console.log(`Attempting to connect to network: ${networkName}...`);
    this.closeWifiMenu();
  }

  protected getSignalColor(strength: number): string {
    if (strength <= 30) return 'text-primary-red';
    if (strength <= 60) return 'text-primary-orange';
    return 'text-accent-green';
  }
}
