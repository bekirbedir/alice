import { Pipe, PipeTransform } from "@angular/core";
import { stringToKeyValue } from "@angular/flex-layout/extended/typings/style/style-transforms";

@Pipe({
  name: "dateToLocalStr",
  pure:false
})
export class dateToLocalStr implements PipeTransform {
  newstring: any;

  constructor() {
    console.log("Creating  Pipe.");
  }

  transform(value: Date , args?: any): any {
    if (value === undefined) {
      return value;
    }

    if (value === null) {
      return 
    }
    console.log("value*-" ,   value)
    return value.toLocaleString();
   
  }
}