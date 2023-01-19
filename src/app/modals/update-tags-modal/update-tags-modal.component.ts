import { Component, OnInit, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Tag } from "src/app/components/venues/venue-profile/venue-profile.component";

@Component({
  selector: "app-update-tags-modal",
  templateUrl: "./update-tags-modal.component.html",
  styleUrls: ["./update-tags-modal.component.less"],
})
export class UpdateTagsModalComponent implements OnInit {
  tagsForm: FormGroup;
  availableTags: Tag[];

  constructor(
    @Inject(MAT_DIALOG_DATA) tagModalData: TagModalData,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateTagsModalComponent>
  ) {
    const { availableTags, tagsSelected } = tagModalData;
    this.availableTags = availableTags;
    const controls = availableTags.map((tag) => {
      const isPresent =
        tagsSelected.findIndex((selectedTag) => selectedTag.id === tag.id) >= 0;
      return isPresent;
    });
    this.tagsForm = fb.nonNullable.group({
      tags: fb.array(controls),
    });
  }

  get tagFormArray() {
    return (this.tagsForm.get("tags") as FormArray).controls;
  }

  ngOnInit(): void {}

  onSave() {
    const { tags } = this.tagsForm.value;
    const selectedTags = [];
    (tags as boolean[]).forEach((isPresent, index) => {
      isPresent && selectedTags.push(this.availableTags[index]);
    });
    this.dialogRef.close(selectedTags);
  }
}

export interface TagModalData {
  availableTags: Tag[];
  tagsSelected: Tag[];
}
