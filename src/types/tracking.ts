export interface TrackingData {
  Number: string;
  StatusCode: string;
  StatusDescription?: string;
  ScheduledDeliveryDate?: string;
  WarehouseSenderAddress?: string;
  WarehouseRecipientAddress?: string;
  CreatedAt?: string;
  DateCreated?: string;
  CreateTime?: string;
  RecipientFullName?: string;
  Recipient?: string;
  RecipientName?: string;
  SenderFullNameEW?: string;
  CounterpartyFullNameSender?: string;
  CounterpartySenderDescription?: string;
  SenderFullName?: string;
  Sender?: string;
  DocumentWeight?: string;
  Weight?: string;
  DocumentCost?: string;
  Cost?: string;
  AnnouncedPrice?: string;
  CargoDescription?: string;
  CargoDescriptionString?: string;
  Items?: Array<{
    StatusCode?: string;
    Sender?: string;
    SenderFullNameEW?: string;
    CounterpartySenderDescription?: string;
    CounterpartySenderType?: string;
  }>;
}

export interface TrackingResponse {
  success: boolean;
  data: TrackingData[];
  errors?: string[];
}
