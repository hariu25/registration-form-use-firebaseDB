import { Component, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistryServiceService } from '../service/registry-service.service';
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DATE_FORMATS } from '@angular/material/core';


@Component({
  selector: 'app-registration-home',
  templateUrl: './registration-home.component.html',
  styleUrls: ['./registration-home.component.css'],
  providers: [DatePipe,{ provide: MAT_DATE_FORMATS, useValue: {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'MM/YYYY',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  }}]
})
export class RegistrationHomeComponent {
  registrationForm!: FormGroup;
  registryList: any[] = [];
  selectedFile: any;
  imagePreview: string | ArrayBuffer | null = null;
  number: any;
  imagePre: string | ArrayBuffer | null = null;

  buttonLabel = 'Add';
  selectImage: any;
  model=""
  dateOfBirth='';
  date: Date[] | undefined;



  constructor(
    private fb: FormBuilder,
    private registryService: RegistryServiceService,
    private elementRef: ElementRef,
    private datePipe: DatePipe,
    private firestore: AngularFirestore
  ) {}
  ngOnInit(): void {

    this.registrationForm = this.fb.group({
      lnMemID: [''],
      InName: [''],
      lnDOB: [''],
      address1: [''],
      address2: [''],
      address3: [''],
      joiningDate: [''],
      lnBirthDate: [Date, Validators.required ],
      eMail: [''],
      lnMobile1: [''],
      lnMobile2: [''],
      poCode: [''],
      occuption: [''],
      lnsName: [''],
      lnsDob: [''],
      lnsBirthDate: [''],
      weddingDate: [],
      InsMemID: [''],
      lnsMobile1: [''],
      lnsMobile2: [''],
      id: [''],
      joining:[''],
      children: this.fb.array([]),
    });

    this.getRegistry();

  }

  get childrens() {
    return this.registrationForm.get('children') as FormArray;
  }

  addChild() {

    const childForm = this.fb.group({
      name: [''],
      birthday: [''],
    });
    this.childrens.push(childForm);
  }

  registrationSubmit() {
    const val = this.registryList;
    if (this.buttonLabel === 'Add') {
      this.addData();
    } else {
      this.updataData();
    }
  }

  add(){
    console.log("date",this.dateOfBirth)
  }


  addData() {
    const formValue = this.registrationForm.value;
    formValue.lnBirthDate = new Date(formValue.lnBirthDate);
    formValue.lnDob = this.formatDate1(formValue.lnBirthDate);




    this.registryService.addData(formValue).then(() => {
      console.log('Data added successfully!');
      this.registrationForm.reset();
    });
  }

  getRegistry(): void {
    this.registryService.getData().subscribe({
      next: (res) => {
        this.registryList = res.map((e: any) => {
          console.log(this.registryList);
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      error: (err) => {
        alert('Error while fetching student data');
        console.error('Error fetching student data:', err);
      },
    });
  }

  onEdit(newData: any) {
    this.buttonLabel = 'Update';
    if (newData.children) {
      newData.children.forEach((child: any) => {
        this.childrens.push(
          this.fb.group({
            name: [child.name, Validators.required],
            birthday: [child.birthday, Validators.required],
          })
        );
      });
    }
    let registerData = {
      lnMemID: newData.lnMemID,
      InName: newData.InName,
      lnDOB: newData.lnDOB,
      address1: newData.address1,
      address2: newData.address2,
      address3: newData.address3,
      joiningDate: newData.joiningDate,
      lnBirthDate: newData.lnBirthDate,
      eMail: newData.eMail,
      lnMobile1: newData.lnMobile1,
      lnMobile2: newData.lnMobile2,
      poCode: newData.poCode,
      occuption: newData.occuption,
      lnsName: newData.lnsName,
      lnsDob: newData.lnsDob,
      lnsBirthDate: newData.lnsBirthDate,
      weddingDate: newData.weddingDate,
      InsMemID: newData.InsMemID,
      lnsMobile1: newData.lnsMobile1,
      lnsMobile2: newData.lnsMobile2,
      id: newData.id,
    };
    this.imagePreview = newData.lnPhoto;
    this.imagePre = newData.lnsPhoto;
    this.registrationForm.patchValue(registerData);
  }

  delete(data: any) {
    this.registryService.deleteData(data.id).then(() => {
      alert('File deleted successfully');
    });
  }

  imageSelected(event: any): void {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(image);
    }
  }

  updataData() {
    // const val=data
    const values = this.registrationForm.value;
    const childrenData = values.children.map((child: any) => ({
      name: child.name,
      birthday: child.birthday,
    }));


    const inputData = {
      lnMemID: values.lnMemID,
      InName: values.InName,
      lnDOB: values.lnDOB,
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      joiningDate: values.joiningDate,
      lnBirthDate: values.lnBirthDate,
      eMail: values.eMail,
      lnMobile1: values.lnMobile1,
      lnMobile2: values.lnMobile2,
      poCode: values.poCode,
      occuption: values.occuption,
      lnsName: values.lnsName,
      lnsDob: values.lnsDob,
      lnsBirthDate: values.lnsBirthDate,
      weddingDate: values.weddingDate ? Timestamp.fromDate(new Date(values.weddingDate)) : null,
      InsMemID: values.InsMemID,
      lnsMobile1: values.lnsMobile1,
      lnsMobile2: values.lnsMobile2,
      id: values.id,
      lnPhoto: this.imagePreview ? this.imagePreview.toString() : '',
      lnsPhoto: this.imagePre ? this.imagePre.toString() : '',
      children: childrenData,
    };

    this.registryService.updateMember(inputData, inputData.id).then(() => {
      alert(' Updated successfully!');
      location.reload()
      // this.getRegistry()
    });
  }

  openModal(data: any) {
    // this.onEdit(data);
    // this.selectImage = data;
  }

  imageSelectedIns(data: any) {
    const image1 = data.target.files[0];
    if (image1) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePre = reader.result;
      };
      reader.readAsDataURL(image1);
    }
  }

  insModal(data: any) {
    this.onEdit(data);
    this.selectImage = data;
  }

  addModal(data:any){
this.onEdit(data);
// this.addChild()
  }

  removeChild(index: number) {
    this.childrens.removeAt(index);
  }

  close(){
    location.reload()
  }
  private datetoTimestamp(dateString: string): Timestamp {
    if (!dateString) return Timestamp.fromDate(new Date());

    console.log(dateString);

    // curDate: Timestamp;

    let curDate = Timestamp.fromDate(new Date(dateString));


    return curDate;
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM-yyyy') ?? '';
  }


  private formatDate1(date: Date): string {
    return this.datePipe.transform(date, 'dd-MMM') ?? '';
  }

}
