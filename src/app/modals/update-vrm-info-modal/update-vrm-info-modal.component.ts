import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  Locale,
  Vrm,
} from "src/app/components/venues/venue-profile/venue-profile.component";

@Component({
  selector: "app-update-vrm-info-modal",
  templateUrl: "./update-vrm-info-modal.component.html",
  styleUrls: ["./update-vrm-info-modal.component.less"],
})
export class UpdateVrmInfoModalComponent implements OnInit {
  vrmForm = this.fb.group({
    status: "",
    lastVisitBy: "",
    lastVisit: "",
    loginsGiven: "",
    marketingConsent: "",
    lastPhotoshoot: "",
    cloudDir: "",
    assignee: "",
    note: "",
    locale: this.fb.nonNullable.group({
      country: "",
      region: "",
      city: "",
    }),
  });

  readonly displayOptions = {
    status: ['On board', 'To contact', 'In talks', 'Not interested'],
    lastVisit: ['Polly', 'Fred'],
    marketingConsent: ['Yes', 'No', 'Messaged'],
    loginsGiven: ['Done', 'Emailed', 'No'],
    city: ['Nottingham', 'Birmingham', 'Greenville', 'Manchester', 'Bristol', 'Derby'],
    assignee: ['Polly', 'Fred']
  };

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: VRMFormData,
    private dialogRef: MatDialogRef<UpdateVrmInfoModalComponent>
  ) {
    if (data != null) {
      const { vrm, locale } = data;
      this.vrmForm.setValue({locale: {...locale}, ...vrm });
    }
  }

  ngOnInit(): void {}

  onUpdate() {
    if (!this.vrmForm.valid) return;
    const savedValue = this.vrmForm.value;
    const { locale, ...vrm } = savedValue;
    const data = { vrm, locale };
    this.dialogRef.close(data);
  }
}

export interface VRMFormData {
  vrm: Vrm;
  locale: Locale;
}
