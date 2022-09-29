export interface InputProps {
  arrayValues?: any[];
  name: string;
  defaultChars?: number;
  optional?: boolean;
  NoterrorMessage?: boolean;
  onChangeCustom?: any;
  isFill?: boolean;
  title?: string;
  register?: any;
  customPlaceholder?: string;
  rules?: Record<string, unknown>;
  rightImg?: string | undefined;
  isDirty?: any;
  leftImg?: string | undefined;
  InputSelect?: any;
  setValueInput?: any;
  labelVisible?: boolean;
  verifyValue?: any;
  primary?: boolean;
  reset?: any;
  handleVerification?: any;
  rightClick?: () => void;
  leftClick?: () => void;
  error?: any;
  classNameContainer?: string;
}
