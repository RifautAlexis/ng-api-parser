import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { AbstractComponent } from './zabstract-component.component';


/**
 * Material Design card component. Cards contain content and actions about a single subject.
 * See https://material.io/design/components/cards.html
 *
 * MatCard provides no behaviors, instead serving as a purely visual treatment.
 */
@Injectable({providedIn: 'root'})
@Component({
  selector: 'my-test',
  standalone: true,
  templateUrl: './my-test.component.html',
  styleUrls: ['./my-test.component.scss'],
  imports: [CommonModule],
})
export class MyTestComponent extends AbstractComponent implements OnInit, AfterContentInit {
  private myDependency = inject(HttpClient);

  /** It is an Input decorator */
  @Input({required: true}) myInput: number = 0;

  /** It is an Output decorator */
  @Output() myOutput: EventEmitter<string> = new EventEmitter<string>();

  
  /** It is a private property */
  private myBoolean: boolean = true;
  
  /** It is an preotected property */
  protected myString?: string = 'a string';
  
  /** It is an preotected property */
  protected mySecondString = 'another string';
  
  /** It is an preotected property */
  protected myCustomInterface: MyInterface = {} as MyInterface;
  
  /** It is an preotected property */
  protected myCustomClass: MyClass = {} as MyClass;
  
  /** It is an preotected property */
  protected myCustomEnum: MyEnum = MyEnum.One; 
  
  /** It is a property without visibility */
  myUntypedProperty: any;
  
  
  /** It is a public constructor */
  constructor() {
    super();
    console.log('CONSTRUCTOR');
  }
  
  /** It is a public function */
  ngOnInit() {
    console.log('ON INIT');
  }
  
  /** It is a public function */
  ngAfterContentInit(): void {
    console.log('AFTER VIEW INIT');
  }
  
  /** It is a private function */
  private myFunction(myString: string, myNumber: number): number {
    console.log('MY FUNCTION', myString, myNumber);
    return 55;
  }
}

/** Object that can be used to configure the default options for the card module. */
export interface MyInterface {
  /** Default appearance for cards. */
  firstProperty: string;
}

export class MyClass {
  secondProperty: string = '';
}

export enum MyEnum {
  One,
  Two,
  Three,
}

function inject(Toto: any) {
throw new Error('Function not implemented.');
}
