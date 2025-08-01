import React, { useState } from "react";
import {
  Panel,
  PanelType,
  Dropdown,
  IDropdownOption,
  Spinner,
  SpinnerSize,
  TextField,
  PrimaryButton,
  DefaultButton,
  Stack,
  IStackTokens,
} from "@fluentui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
interface AddBusinessPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (business: any) => Promise<void>;
}
const businessTypes: IDropdownOption[] = [
  { key: "Limited", text: "Limited" },
  { key: "LLP", text: "LLP" },
  { key: "Individual", text: "Individual" },
  { key: "Unknown", text: "Unknown" },
];
const BusinessSchema = Yup.object().shape({
  type: Yup.string().required("Please select a type"),
  name: Yup.string().required("Business name is required"),
});
const stackTokens: IStackTokens = { childrenGap: 15 };
export const AddBusinessPanel: React.FC<AddBusinessPanelProps> = ({
  isOpen,
  onDismiss,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleAddBusiness = async (values: any, resetForm: () => void) => {
    setIsLoading(true);
    try {
      await onSave(values);
      resetForm();
      onDismiss();
    } catch (error) {
      console.error("Failed to add business", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Add Business"
      type={PanelType.medium}
    >
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
        onSubmit={(values, { resetForm }) =>
          handleAddBusiness(values, resetForm)
        }
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
                  errorMessage={
                    touched.type && errors.type ? errors.type : undefined
                  }
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
                <TextField
                  label="Business Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  errorMessage={
                    touched.name && errors.name ? errors.name : undefined
                  }
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
              </Stack>

              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <TextField
                  placeholder="Country"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
                <TextField
                  placeholder="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <TextField
                  placeholder="Building"
                  name="building"
                  value={values.building}
                  onChange={handleChange}
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
                <TextField
                  placeholder="Street"
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <TextField
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
                <TextField
                  placeholder="Postal Code"
                  name="postalCode"
                  value={values.postalCode}
                  onChange={handleChange}
                  disabled={isLoading}
                  styles={{ root: { flexGrow: 1 } }}
                />
              </Stack>
              <Stack styles={{ root: { marginTop: "300px" } }}>
                {isLoading ? (
                  <Spinner
                    label="Adding business..."
                    size={SpinnerSize.medium}
                  />
                ) : (
                  <Stack
                    horizontal
                    horizontalAlign="end"
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: 8,
                      position: "absolute",
                      bottom: "0px",
                      right: "0px",
                      padding: "10px",
                    }}
                    tokens={{ childrenGap: 10 }}
                  >
                    <DefaultButton
                      text="Cancel"
                      onClick={onDismiss}
                      iconProps={{ iconName: "cancel" }}
                    />
                    <PrimaryButton
                      type="submit"
                      text="Save"
                      iconProps={{ iconName: "save" }}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Panel>
  );
};
