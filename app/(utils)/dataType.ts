export enum DataType {
  Integer = "Integer",
  Decimal = "Decimal",
  Character = "Character",
  String = "String",
  Boolean = "Boolean",
}

export enum DataTypePinColor {
  Integer = "greenyellow",
  Decimal = "green",
  Character = "blue",
  String = "purple",
  Boolean = "red",
}

export function getPinColor(dataType: DataType): DataTypePinColor {
  switch (dataType) {
    case DataType.Integer:
      return DataTypePinColor.Integer;
    case DataType.Decimal:
      return DataTypePinColor.Decimal;
    case DataType.Character:
      return DataTypePinColor.Character;
    case DataType.String:
      return DataTypePinColor.String;
    case DataType.Boolean:
      return DataTypePinColor.Boolean;
    default:
      return DataTypePinColor.Boolean;
  }
}
