import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeFilter',
})
export class EmployeeFilterPipe implements PipeTransform {
  transform(employees: any[], name: string, email: string, gender: string, skill: string): any[] {
    if (!employees) return [];
    // إذا لم تكن هناك بيانات (قائمة employees فارغة أو غير معرفة)، يرجع مصفوفة فاضية.

    return employees.filter((term) =>
      (!name || term.name.toLowerCase().includes(name.toLowerCase()))
      // إذا كان المستخدم لم يكتب أي شيء في حقل الاسم ⇒ لا يتم التحقق (يعني يظهر الكل).
      // وإذا كتب شيء ⇒ يتم التحقق هل الاسم يحتوي على الكلمة المكتوبة.
      &&
      (!email || term.email.toLowerCase().includes(email.toLowerCase())) &&
      (!gender || term.gender.toLowerCase().startsWith(gender.toLowerCase())) 
      // يقوم بالفلترة حسب أول حرف من الجنس (مثل "m" لـ male أو "f" لـ female).
      &&
      (!skill || term.skill.toLowerCase().includes(skill.toLowerCase()))
    );
  }
}
