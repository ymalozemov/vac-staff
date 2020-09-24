import { FormArray, FormGroup, FormControl } from '@angular/forms';

export class MyValidators {
  static requiredRefNumbers(controls: FormArray) {
    if (controls.value.length <= 0) {
      return { required: true }
    }
    return null
  }
  static requiredBarcodes(controls: FormArray) {
    if (controls.controls.find(control => control.hasError('required'))) {
      return { required: true }
    }
    return null
  }
  static minLengthBarcodes(controls: FormArray) {
    if (controls.controls.find(control => control.hasError('minlength'))) {
      return { minlength: true }
    }
    return null
  }
  static maxLengthBarcodes(controls: FormArray) {
    if (controls.controls.find(control => control.hasError('maxlength'))) {
      return { maxlength: true }
    }
    return null
  }
  static formValidador(form: FormGroup) {
    if (+form.get('applicant').value != +form.get('refCount').value) {
      return { applicantBarcodes: true }
    }
    return null
  }
  static hasBarcodes(form: FormGroup) {
    if ((form.get('barcodesRus').value.length + form.get('barcodesGratis').value.length + form.get('barcodesFullGratis').value.length + form.get('barcodesNonRus').value.length) <= 0) {
      return { hasBarcodes: true }
    }
    return null
  }
  static ppbFoxCount(form: FormGroup) {
    if ((form.get('ppb').value != null && form.get('foxValue').value != null && form.get('applicant').value != null) && (form.get('ppb').value + form.get('foxCount').value > form.get('applicant').value)) {
      return { ppbFoxCount: true }
    }
    return null
  }
  static ppbCount(form: FormGroup) {
    if ((form.get('applicant').value != null && form.get('ppb').value != null) && (form.get('applicant').value < form.get('ppb').value)) {
      return { ppbCount: true }
    }
    return null
  }
  static foxCount(form: FormGroup) {
    if ((form.get('foxValue').value != null && form.get('applicant').value != null) && (form.get('foxCount').value > form.get('applicant').value)) {
      return { foxCount: true }
    }
    return null
  }
  static persCount(form: FormGroup) {
    if ((form.get('pers').value != null && form.get('applicant').value != null) && (form.get('pers').value > form.get('applicant').value)) {
      return { persCount: true }
    }
    return null
  }
  static smsCount(form: FormGroup) {
    if ((form.get('sms').value != null && form.get('applicant').value != null) && (form.get('sms').value > form.get('applicant').value)) {
      return { smsCount: true }
    }
    return null
  }
  static vipCount(form: FormGroup) {
    if ((form.get('vip').value != null && form.get('applicant').value != null) && (form.get('vip').value > form.get('applicant').value)) {
      return { vipCount: true }
    }
    return null
  }
  static formCount(form: FormGroup) {
    if ((form.get('form').value != null && form.get('applicant').value != null) && (form.get('form').value > form.get('applicant').value)) {
      return { formCount: true }
    }
    return null
  }
  static photoCount(form: FormGroup) {
    if ((form.get('photo').value != null && form.get('applicant').value != null) && (form.get('photo').value > form.get('applicant').value)) {
      return { photoCount: true }
    }
    return null
  }
}
