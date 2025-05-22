export interface InternetDocumentProps {
  PayerType: string;
  PaymentMethod: string;
  CargoType: string;
  Weight: number;
  ServiceType: string;
  SeatsAmount: number;
  Description: string;
  Cost: number;
  CitySender: string;
  CityRecipient: string;
  WarehouseRecipient?: string;
  WarehouseSender?: string;
  RecipientAddress?: string;
  SenderAddress?: string;
  VolumeGeneral?: number;
  OptionsSeat?: OptionsSeat[];
}

export interface OptionsSeat {
  weight: number;
  volumetricWidth: number;
  volumetricLength: number;
  volumetricHeight: number;
}

export interface PriceCalculationRequest {
  apiKey: string;
  modelName: string;
  calledMethod: string;
  methodProperties: InternetDocumentProps;
}

export interface PriceCalculationResponse {
  success: boolean;
  data: PriceData[];
  errors?: string[];
  warnings?: string[];
  info?: string[];
  messageCodes?: string[];
  errorCodes?: string[];
  warningCodes?: string[];
  infoCodes?: string[];
}

export interface PriceData {
  Cost: number;
  CostRedelivery: number;
  AssessedCost: number;
  CostPerHeightCapacity: number;
  CostPack: number;
  TotalCost: number;
  CostOverWeight: number;
  CostOverSize: number;
}

export interface City {
  ref: string;
  name: string;
}
