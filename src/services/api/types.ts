export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export interface NovaPoshtaRequest<T> {
  apiKey: string;
  modelName: string;
  calledMethod: string;
  methodProperties: T;
}

export interface SearchSettlementsProps {
  CityName: string;
  Limit?: number;
  Page?: number;
}

export interface SettlementAddress {
  Present: string;
  Warehouses: number;
  MainDescription: string;
  Area: string;
  Region: string;
  SettlementTypeCode: string;
  Ref: string;
  DeliveryCity: string;
}

export interface SearchSettlementsResponse {
  success: boolean;
  data: Array<{
    TotalCount: number;
    Addresses: SettlementAddress[];
  }>;
  errors: string[];
  warnings: string[];
  info: string[];
}

export enum WarehouseType {
  BRANCH = '841339c7-591a-42e2-8233-7a0a00f0ed6f',
  CARGO = '9a68df70-0267-42a8-bb5c-37f427e36ee4',
  POSTOMAT = 'f9316480-5f2d-425d-bc2c-ac7cd29decf0',
}

export interface WarehouseProps {
  SettlementRef: string;
  Page?: number;
  Limit?: number;
  Language?: string;
  TypeOfWarehouseRef?: string;
}

export interface DaySchedule {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

export interface WarehouseData {
  Description: string;
  ShortAddress: string;
  Phone: string;
  Number: string;
  PlaceMaxWeightAllowed: string;
  TotalMaxWeightAllowed: string;
  Reception: DaySchedule;
  Delivery: DaySchedule;
  Schedule: DaySchedule;
  TypeOfWarehouse: string;
  Ref: string;
  CityRef: string;
  CityDescription: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementAreaDescription: string;
  SettlementRegionsDescription: string;
  SettlementTypeDescription: string;
  Longitude: string;
  Latitude: string;
  PostFinance: string;
  POSTerminal: string;
  InternationalShipping: string;
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowedOn1Place: string;
  CanGetMoneyTransfer: string;
  CanSendMoneyTransfer: string;
}

export interface WarehouseResponse {
  success: boolean;
  data: WarehouseData[];
  errors: string[];
  warnings: string[];
  info: string[];
  messageCodes: string[];
  errorCodes: string[];
  warningCodes: string[];
  infoCodes: string[];
}

export interface TrackDocumentProps {
  Documents: Array<{
    DocumentNumber: string;
  }>;
}

export interface TrackDocumentData {
  Number: string;
  StatusCode: string;
  StatusDescription?: string;
  ScheduledDeliveryDate?: string;
  WarehouseSenderAddress?: string;
  WarehouseRecipientAddress?: string;
  CreatedAt?: string;
  RecipientFullName?: string;
  SenderFullName?: string;
  DocumentWeight?: string;
  DocumentCost?: string;
  CargoDescription?: string;
  CargoDescriptionString?: string;
  Weight?: string;
  Cost?: string;
}

export interface TrackDocumentResponse {
  success: boolean;
  data: TrackDocumentData[];
  errors: string[];
  warnings: string[];
  info: string[];
}
