import { NgClass } from '@angular/common';
import { Component, inject, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup , FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iemployee } from '../../interface/iemployee';



@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule,NgClass,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    private readonly formBuilder=inject(FormBuilder)
    employees: Iemployee[] = []; 
    isEditMode = false; 
    // نستخدمها علشان نعرف هل إحنا بنعدل ولا بنضيف موظف جديد
    // لو ب true يبقي ف حالة تعديل لو ب false يبقي ف حالة اضافة
    editIndex: number | null = null;
    // بتخزن رقم الموظف الجاري تعديله.
    searchName: string = '';
    searchEmail: string = '';
    searchGender: string = '';
    searchSkill: string = '';


    Login:FormGroup = this.formBuilder.group({
      name:[null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      email:[null,[Validators.required,Validators.email]],
      skill:[null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      gender:[null,[Validators.required]],
    })

  ngOnInit(): void {
    const data = localStorage.getItem('employees');
    // تحاول جلب البيانات المخزّنة مسبقًا في المتصفح باستخدام المفتاح 'employees'.
      if (data) {
      this.employees = JSON.parse(data);
      // إذا وُجدت بيانات، يتم تحويلها من نص (string) بصيغة JSON إلى مصفوفة كائنات (array of objects) باستخدام JSON.parse()، ثم تُخزن في المتغير this.employees.
    }
  }

  updateLocalStorage(): void {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    // JSON.stringify(this.employees): تحويل مصفوفة الموظفين إلى نص (JSON string) لأن localStorage يخزن البيانات كنصوص فقط.
    // localStorage.setItem(...): يتم حفظ النص الناتج في localStorage باسم 'employees'.
}

  deleteEmployee(index: number): void {
    this.employees.splice(index,1); // this.employees.splice(index, 1): يقوم بحذف عنصر واحد من المصفوفة employees عند الموضع المحدد بـ index.
    this.updateLocalStorage();       //this.updateLocalStorage(): يتم بعد ذلك تحديث البيانات المحفوظة في localStorage بعد التعديل.
  }


  submitForm(): void {
  if (this.Login.valid) {
    //  لو النموذج صالح:اي في بيانات مش فاضي

    const employeeData = this.Login.value;    
    //  عملت var عشان امسك بيه ال  value اي data 
    // بنأخذ البيانات منه.

    if (this.isEditMode && this.editIndex !== null) {
    // هل المستخدم حالياً في وضع التعديل؟ (isEditMode = true)
    // وهل رقم الموظف اللي بيعدله معروف؟ (editIndex !== null

    this.employees[this.editIndex] = employeeData;
    // باستخدام this.editIndex علشان نعرف رقم الموظف داخل المصفوفة.
    // وبيتم استبدال بياناته بالكامل بالقيم الجديدة اللي المستخدم كتبها في النموذج (employeeData).
      this.isEditMode = false;
      // بنرجع المتغير isEditMode لـ false علشان البرنامج يرجع لوضع الإضافة.
      this.editIndex = null;
      // وبنصفر editIndex علشان ميبقاش في موظف محدد للتعديل حاليًا.
    } else {
      // إضافة موظف جديد لو مش وضع التعديل
      this.employees.push(employeeData);
    }
    this.updateLocalStorage()

    this.Login.reset(); // امسح النموذج بعد الحفظ
  }
}


editEmployee(index: number): void {
  // بتستقبل رقم الموظف (index) اللي المستخدم عايز يعدل بياناته.
  const employee = this.employees[index];
  // بنجيب بيانات الموظف من المصفوفة employees باستخدام index (رقم الصف اللي اتضغط فيه على "Edit").
  // بنخزن البيانات دي في متغير employee.
  this.Login.patchValue(employee); 
  // بنستخدم patchValue() علشان نملأ النموذج Login تلقائيًا ببيانات الموظف اللي اختارناه.
  // كأن البيانات اتكتبت في النموذج تلقائيًا علشان المستخدم يبدأ يعدلها.
  this.isEditMode = true;
  // بنفعل وضع التعديل علشان لما المستخدم يضغط على الزر الرئيسي، يتم تعديل الموظف بدل إضافة واحد جديد.
  this.editIndex = index;
  // بنخزن index (رقم الموظف في المصفوفة) علشان نستخدمه لاحقًا لما يتم حفظ التعديلات.
  // ودا الموجود في parameter
}


get filterEmployees(): Iemployee[] {
  return this.employees.filter((term) =>
    term.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
    term.email.toLowerCase().includes(this.searchEmail.toLowerCase()) &&
    term.gender.toLowerCase().startsWith(this.searchGender.toLowerCase()) &&
    term.skill.toLowerCase().includes(this.searchSkill.toLowerCase())
  );
}


}
