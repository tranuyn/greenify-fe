export interface Province {
  code: string;
  name: string;
  codename?: string;
  divisionType?: string;
  phoneCode?: string;
}

export interface Ward {
  code: string;
  name: string;
  codename?: string;
  divisionType?: string;
  provinceCode?: string;
  province_code?: string;
}
