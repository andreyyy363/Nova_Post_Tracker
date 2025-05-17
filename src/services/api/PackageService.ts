import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingData } from '../../types/tracking';

export class PackageService {
  static readonly ALL_PACKAGES_KEY = 'all_packages';

  static validateTrackingNumber(trackingNumber: string): { isValid: boolean; message: string } {
    if (!trackingNumber || typeof trackingNumber !== 'string') {
      return { 
        isValid: false, 
        message: 'Номер посилки не може бути порожнім' 
      };
    }
    
    const cleanNumber = trackingNumber.trim().replace(/\s+/g, '');
    
    if (/^\d{14}$/.test(cleanNumber)) {
      return { isValid: true, message: '' };
    } else if (/^59\d{18}$/.test(cleanNumber)) {
      return { isValid: true, message: '' };
    } else {
      return { 
        isValid: false, 
        message: 'Невірний формат номера посилки. Має бути 14 цифр для внутрішньої або 20 цифр для міжнародної відправки.' 
      };
    }
  }
  
  static async validatePackageAccess(trackingNumber: string): Promise<{ 
    authorized: boolean; 
    message: string;
    cleanNumber?: string; 
  }> {
    const cleanNumber = trackingNumber.trim().replace(/\s+/g, '');
    
    const validation = this.validateTrackingNumber(cleanNumber);
    if (!validation.isValid) {
      return { authorized: false, message: validation.message };
    }
    
    const savedPackages = await this.getAllSavedPackages();
    const isUserPackage = this.isPackageInList(cleanNumber, savedPackages);
    
    if (!isUserPackage) {
      return { 
        authorized: false, 
        message: 'Цей номер посилки не належить до списку ваших посилок. Додайте посилку, щоб переглянути деталі.',
        cleanNumber
      };
    }
    
    return { authorized: true, message: '', cleanNumber };
  }
  
  static async savePackageToStorage(packageData: TrackingData): Promise<{ 
    success: boolean; 
    message: string;
    packageData?: TrackingData;
  }> {
    try {
      if (!packageData || !packageData.Number) {
        return { success: false, message: 'Дані посилки відсутні або неповні' };
      }
      
      const validation = this.validateTrackingNumber(packageData.Number);
      if (!validation.isValid) {
        return { success: false, message: validation.message };
      }
      
      const cleanNumber = packageData.Number.trim().replace(/\s+/g, '');
      packageData.Number = cleanNumber;
      
      let savedPackages = await this.getAllSavedPackages();
      
      const exists = savedPackages.some(pkg => pkg.Number === cleanNumber);
      if (exists) {
        return { 
          success: false, 
          message: 'Ця посилка вже додана до списку ваших посилок',
          packageData
        };
      }
      
      savedPackages.push(packageData);
        
      await AsyncStorage.setItem(this.ALL_PACKAGES_KEY, JSON.stringify(savedPackages));
      console.log("Посилку додано до збережених:", packageData.Number);
      return { 
        success: true, 
        message: 'Посилку успішно додано до списку',
        packageData
      };
    } catch (error) {
      console.error("Помилка при збереженні посилки:", error);
      return { success: false, message: 'Виникла помилка при збереженні посилки' };
    }
  }
  
  static async getAllSavedPackages(): Promise<TrackingData[]> {
    try {
      const savedPackagesStr = await AsyncStorage.getItem(this.ALL_PACKAGES_KEY);
      if (savedPackagesStr) {
        return JSON.parse(savedPackagesStr);
      }
      return [];
    } catch (error) {
      console.error("Помилка при отриманні збережених посилок:", error);
      return [];
    }
  }
  
  static async removePackage(packageNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!packageNumber) {
        return { success: false, message: 'Не вказано номер посилки для видалення' };
      }
      
      const cleanNumber = packageNumber.trim().replace(/\s+/g, '');
      
      const savedPackages = await this.getAllSavedPackages();
      
      const existingPackage = savedPackages.find(pkg => pkg.Number === cleanNumber);
      if (!existingPackage) {
        return { success: false, message: 'Посилка з таким номером не знайдена в списку' };
      }
      
      const updatedPackages = savedPackages.filter(pkg => pkg.Number !== cleanNumber);
      
      await AsyncStorage.setItem(this.ALL_PACKAGES_KEY, JSON.stringify(updatedPackages));
      console.log("Посилку видалено зі збережених:", cleanNumber);
      
      return { success: true, message: 'Посилку успішно видалено зі списку' };
    } catch (error) {
      console.error("Помилка при видаленні посилки:", error);
      return { success: false, message: 'Виникла помилка при видаленні посилки' };
    }
  }
  
  static getPackageStatus(packageData: TrackingData): string {
    if (!packageData) return 'Інформація відсутня';
    
    const status = (packageData as any).Status;
    const statusDescription = packageData.StatusDescription || (packageData as any).StatusDescription;
    
    if (status) return status;
    if (statusDescription) return statusDescription;
    if (packageData.StatusCode) return `Статус: ${packageData.StatusCode}`;
    
    return 'Статус невідомий';
  }
  
  static isPackageInList(packageNumber: string, packages: TrackingData[]): boolean {
    if (!packageNumber || !packages || packages.length === 0) {
      return false;
    }
    
    const cleanNumber = packageNumber.trim().replace(/\s+/g, '');
    return packages.some(pkg => pkg.Number === cleanNumber);
  }
}