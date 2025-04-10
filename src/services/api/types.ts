export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Nova Poshta API general request format
export interface NovaPoshtaRequest<T> {
  apiKey: string;
  modelName: string;
  calledMethod: string;
  methodProperties: T;
}

// City search request properties
export interface SearchSettlementsProps {
  CityName: string;
  Limit?: number;
  Page?: number;
}

// City search response
export interface SearchSettlementsResponse {
  success: boolean;
  data: {
    TotalCount: number;
    Addresses: Array<{
      Present: string;
      Warehouses: number;
      MainDescription: string;
      Area: string;
      Region: string;
      SettlementTypeCode: string;
      Ref: string;
      DeliveryCity: string;
    }>;
  }[];
  errors: string[];
  warnings: string[];
  info: string[];
}

// Warehouse type properties
export interface WarehouseProps {
  SettlementRef: string;
  Page?: number;
  Limit?: number;
  Language?: string;
  TypeOfWarehouseRef?: string;
}

// Warehouse types
export enum WarehouseType {
  BRANCH = '841339c7-591a-42e2-8233-7a0a00f0ed6f', // Regular post office
  CARGO = '9a68df70-0267-42a8-bb5c-37f427e36ee4', // Cargo office
  PARCEL_LOCKER = '95dc212d-479c-4ffb-a8ab-8c1b9073d0bc', // Parcel locker
  POSTOMAT = 'f9316480-5f2d-425d-bc2c-ac7cd29decf0', // Postomat
}

// Warehouse response type
export interface WarehouseResponse {
  success: boolean;
  data: Array<{
    Description: string;
    ShortAddress: string;
    Phone: string;
    Number: string;
    PlaceMaxWeightAllowed: string;
    TotalMaxWeightAllowed: string;
    Reception: {
      Monday: string;
      Tuesday: string;
      Wednesday: string;
      Thursday: string;
      Friday: string;
      Saturday: string;
      Sunday: string;
    };
    Delivery: {
      Monday: string;
      Tuesday: string;
      Wednesday: string;
      Thursday: string;
      Friday: string;
      Saturday: string;
      Sunday: string;
    };
    Schedule: {
      Monday: string;
      Tuesday: string;
      Wednesday: string;
      Thursday: string;
      Friday: string;
      Saturday: string;
      Sunday: string;
    };
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
  }>;
  errors: string[];
  warnings: string[];
  info: string[];
  messageCodes: string[];
  errorCodes: string[];
  warningCodes: string[];
  infoCodes: string[];
}
