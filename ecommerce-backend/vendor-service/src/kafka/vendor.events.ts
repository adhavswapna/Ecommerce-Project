export interface VendorCreatedEvent {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface VendorStatusUpdatedEvent {
  id: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
}

