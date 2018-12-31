export interface IAuctionInfo {
  address: string;
  holder: string;
  highestbidder: string;
  endTime: number;
  highestPrice: number;
  deposit: number;
  valid: boolean;
  isInit: boolean;
  isCancel: boolean;
  currentUserPrice: number;
}