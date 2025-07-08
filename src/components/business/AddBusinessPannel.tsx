import React from "react";
import { Panel, PanelType, Dropdown, IDropdownOption, TextField, PrimaryButton, DefaultButton, Stack, IStackTokens } from "@fluentui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

interface AddBusinessPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (business: any) => void;
}

const businessTypes: IDropdownOption[] = [
  { key: "individual", text: "Individual" },
  { key: "partnership", text: "Partnership" },
  { key: "limited_partnership", text: "Limited Partnership" },
  { key: "llp", text: "LLP" },
];

const BusinessSchema = Yup.object().shape({
  type: Yup.string().required("Please select a type"),
  name: Yup.string().required("Business name is required"),
});

const stackTokens: IStackTokens = { childrenGap: 15 };

export const AddBusinessPanel: React.FC<AddBusinessPanelProps> = ({ isOpen, onDismiss, onSave }) => {
  return (
    <Panel isOpen={isOpen} onDismiss={onDismiss} headerText="Add Business" type={PanelType.medium}>
      <Formik
        initialValues={{
          type: "",
          name: "",
          phoneNumber: "",
          country: "",
          city: "",
          postalCode: "",
          building: "",
          street: "",
        }}
        validationSchema={BusinessSchema}
        onSubmit={(values, { resetForm }) => {
          onSave(values);
          resetForm();
          onDismiss();
        }}
      >
        {({ handleChange, values, errors, touched, setFieldValue }) => (
          <Form>
            <Stack tokens={stackTokens}>
              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <Dropdown
                  label="Type"
                  options={businessTypes}
                  placeholder="Select Type"
                  selectedKey={values.type}
                  onChange={(_, option) => setFieldValue("type", option?.key)}
                  errorMessage={touched.type && errors.type ? errors.type : undefined}
                  style={{ flex: 1 }}
                />

                <TextField
                  label="Business Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  errorMessage={touched.name && errors.name ? errors.name : undefined}
                  style={{ flex: 1 }}
                />
              </Stack>

              <TextField label="Phone Number" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />

              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <TextField label="Country" name="country" value={values.country} onChange={handleChange} style={{ flex: 1 }} />
                <TextField label="City" name="city" value={values.city} onChange={handleChange} style={{ flex: 1 }} />
              </Stack>

              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <TextField label="Building" name="building" value={values.building} onChange={handleChange} style={{ flex: 1 }} />
                <TextField label="Street" name="street" value={values.street} onChange={handleChange} style={{ flex: 1 }} />
              </Stack>

              <TextField label="Postal Code" name="postalCode" value={values.postalCode} onChange={handleChange} />

              <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}>
                <DefaultButton text="Cancel" onClick={onDismiss} />
                <PrimaryButton type="submit" text="Save" />
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Panel>
  );
};
