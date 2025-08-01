import React, { useState } from "react";
import {
  Panel,
  PanelType,
  Stack,
  TextField,
  DatePicker,
  PrimaryButton,
  DefaultButton,
  DayOfWeek,
  IconButton,
  IDropdownOption,
  TagPicker,
  ITag,
  Spinner,
  SpinnerSize,
  Label,
} from "@fluentui/react";
import { Formik, Form, FieldArray, FormikErrors } from "formik";
import * as Yup from "yup";
import API from "../../services/api";
import { BusinessAddress, Invoice } from "./Billing";
import useApi from "../../services/api";

interface InvoicePanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  businessId?: string;
  businessName?: string;
  businessAddress?: BusinessAddress;
  businessList?: IDropdownOption[];
  invoice?: Invoice | null;
  showBusinessDropdown?: boolean;
  onSuccess: (newInvoice: Invoice) => void;
}

interface Service {
  name: string;
  description: string;
  amount: number;
}

interface InvoiceFormValues {
  business?: {
    businessId: string;
    businessName: string;
  };
  services: Service[];
  vatPercentage: number;
  startDate?: Date;
  dueDate?: Date;
}


const InvoiceSchema = Yup.object().shape({
  business: Yup.object().shape({
    businessId: Yup.string().required("Business is required"),
    businessName: Yup.string().required("Business is required"),
  }),
  services: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Service name required"),
        description: Yup.string(),
        amount: Yup.number().required("Amount required"),
      })
    )
    .min(1, "At least one service is required"),
  vatPercentage: Yup.number().required("VAT % is required"),
  startDate: Yup.date().required("Start date is required"),
  dueDate: Yup.date().required("Due date is required"),
});

export default function InvoicePanel({
  isOpen,
  onDismiss,
  businessId,
  businessName,
  businessList,
  showBusinessDropdown = false,
  onSuccess,
  invoice,
}: InvoicePanelProps) {
  const api = useApi();
  const isEdit = Boolean(invoice);
  const [isLoading, setLoading] = useState(false);
  const [allBusinesses, setAllBusinesses] = React.useState<ITag[]>(
    businessList?.map((b) => ({ key: b.key, name: b.text })) || []
  );
  React.useEffect(() => {
    if (businessList) {
      setAllBusinesses(businessList.map((b) => ({ key: b.key, name: b.text })));
    }
  }, [businessList]);

  const filterBusiness = (filterText: string, tagList?: ITag[]): ITag[] => {
    return filterText
      ? allBusinesses
          .filter(
            (tag) =>
              tag.name.toLowerCase().includes(filterText.toLowerCase()) &&
              !tagList?.some((t) => t.key === tag.key)
          )
          .slice(0, 5)
      : [];
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText={isEdit ? "Update Invoice" : "Create Invoice"}
      type={PanelType.medium}
    >
      <Formik<InvoiceFormValues>
        initialValues={{
          business: {
            businessId: showBusinessDropdown
              ? String(invoice?.business?.id || "")
              : String(businessId || ""),
            businessName: showBusinessDropdown
              ? invoice?.business?.name || ""
              : businessName || "",
          },
          services: invoice?.service?.map((s) => ({
            name: s.name,
            description: s.description,
            amount: s.amount,
          })) || [{ name: "", description: "", amount: 0 }],
          vatPercentage: invoice?.vatPercentage ?? 18,
          startDate: invoice?.startDate
            ? new Date(invoice.startDate)
            : undefined,
          dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : undefined,
        }}
        enableReinitialize
        validationSchema={InvoiceSchema}
        onSubmit={async (values, { resetForm }) => {
          setLoading(true);
          try {
            const totalAmount = values.services.reduce(
              (sum, s) => sum + s.amount,
              0
            );
            const payload = {
              business: {
                id: showBusinessDropdown
                  ? values?.business?.businessId
                  : businessId,
                name: showBusinessDropdown
                  ? values?.business?.businessName
                  : businessName,
              },
              service: values?.services,
              amount: totalAmount,
              vatPercentage: values?.vatPercentage,
              startDate: values?.startDate?.toISOString(),
              dueDate: values?.dueDate?.toISOString(),
            };

            const response = isEdit
              ? await api.post(`/invoice/update/${invoice?.id}`, payload)
              : await api.post("/invoice/add", payload);

            onSuccess(response.data.data);
            resetForm();
            onDismiss();
          } catch (err: any) {
            console.error("Failed to save invoice:", err);
            alert(err.response?.data?.message || "Failed to save invoice.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {({
          handleChange,
          values,
          setFieldValue,
          errors,
          touched,
          setFieldTouched,
        }) => {
          const subtotal = values.services.reduce(
            (sum, s) => sum + Number(s.amount),
            0
          );
          const vat = values.vatPercentage || 0;
          const vatAmount = (subtotal * vat) / 100;
          const total = subtotal + vatAmount;

          return (
            <Stack styles={{ root: { overflowY: "auto" } }}>
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  style={{
                    paddingTop: 10,
                  }}
                >
                  <Stack
                    tokens={{ childrenGap: 15 }}
                    style={{ paddingTop: 10 }}
                  >
                    <Stack
                      horizontal
                      verticalAlign="center"
                      tokens={{ childrenGap: 10 }}
                    >
                      <Label>Business Name</Label>
                      {showBusinessDropdown ? (
                        <TagPicker
                          onResolveSuggestions={filterBusiness}
                          getTextFromItem={(item: ITag) => item.name}
                          pickerSuggestionsProps={{
                            suggestionsHeaderText: "Matching businesses",
                            noResultsFoundText: "No match found",
                          }}
                          itemLimit={1}
                          selectedItems={
                            values.business?.businessId
                              ? [
                                  {
                                    key: values.business.businessId,
                                    name: values.business.businessName,
                                  },
                                ]
                              : []
                          }
                          onChange={(selectedItems?: ITag[]) => {
                            if (selectedItems && selectedItems.length > 0) {
                              setFieldValue(
                                "business.businessId",
                                selectedItems[0].key
                              );
                              setFieldValue(
                                "business.businessName",
                                selectedItems[0].name
                              );
                            } else {
                              setFieldValue("business.businessId", "");
                              setFieldValue("business.businessName", "");
                            }
                          }}
                          inputProps={{
                            placeholder: "Search and select a business",
                          }}
                          styles={{
                            root: {
                              ".ms-BasePicker-text text-314": {
                                text: {
                                  height: 30,
                                },
                              },
                              width: 400,
                              paddingLeft: 7,
                            },
                          }}
                        />
                      ) : (
                        <TextField
                          value={businessName}
                          disabled
                          style={{ width: 430 }}
                        />
                      )}
                    </Stack>

                    <Stack horizontal tokens={{ childrenGap: 50 }}>
                      <Label>Start date</Label>
                      <Stack style={{ marginRight: 0 }}>
                        <DatePicker
                          placeholder="Select a date"
                          value={values.startDate}
                          onSelectDate={(date) =>
                            setFieldValue("startDate", date ?? undefined)
                          }
                          onBlur={() => setFieldTouched("startDate", true)}
                          firstDayOfWeek={DayOfWeek.Sunday}
                          style={{ width: 200 }}
                        />
                      </Stack>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 55 }}>
                      <Label>Due date</Label>
                      <Stack.Item style={{ marginRight: 0 }}>
                        <DatePicker
                          placeholder=" Select Due Date"
                          value={values.dueDate}
                          onSelectDate={(date) =>
                            setFieldValue("dueDate", date ?? undefined)
                          }
                          onBlur={() => setFieldTouched("dueDate", true)}
                          firstDayOfWeek={DayOfWeek.Sunday}
                          style={{ width: 200 }}
                        />
                      </Stack.Item>
                    </Stack>

                    <Stack tokens={{ childrenGap: 10 }}>
                      <Stack
                        horizontal
                        tokens={{ childrenGap: 20 }}
                        horizontalAlign="space-between"
                      >
                        <Stack>
                          <Label>Service</Label>
                        </Stack>

                        <Stack style={{ paddingRight: 80 }}>
                          <Label>Description</Label>
                        </Stack>

                        <Stack style={{ paddingRight: 90 }}>
                          <Label>Amount</Label>
                        </Stack>
                      </Stack>

                      <FieldArray name="services">
                        {({ push, remove }) => (
                          <>
                            {values.services.map((service, index) => (
                              <Stack
                                key={index}
                                horizontal
                                tokens={{ childrenGap: 10 }}
                                horizontalAlign="space-between"
                              >
                                <TextField
                                  name={`services[${index}].name`}
                                  value={service.name}
                                  onChange={handleChange}
                                  styles={{
                                    root: { width: "30%" },
                                    field: { height: 32 },
                                  }}
                                  errorMessage={
                                    touched.services &&
                                    touched.services[index] &&
                                    errors.services &&
                                    (errors.services as FormikErrors<any>[])[
                                      index
                                    ]?.name
                                  }
                                />
                                <TextField
                                  name={`services[${index}].description`}
                                  value={service.description}
                                  onChange={handleChange}
                                  styles={{
                                    root: { width: "50%" },
                                    field: { height: 32 },
                                  }}
                                />
                                <TextField
                                  name={`services[${index}].amount`}
                                  type="number"
                                  value={service.amount.toString()}
                                  onChange={handleChange}
                                  styles={{
                                    root: { width: "20%" },
                                    field: { height: 32 },
                                  }}
                                  errorMessage={
                                    touched.services &&
                                    touched.services[index]?.amount &&
                                    errors.services &&
                                    (errors.services as FormikErrors<any>[])[
                                      index
                                    ]?.amount
                                  }
                                />
                                <Stack style={{ width: "5%" }}>
                                  {index >= 0 && (
                                    <IconButton
                                      iconProps={{ iconName: "Delete" }}
                                      title="Remove"
                                      ariaLabel="Remove"
                                      onClick={() => remove(index)}
                                      styles={{
                                        root: { width: 28, height: 28 },
                                      }}
                                    />
                                  )}
                                </Stack>
                              </Stack>
                            ))}
                            <PrimaryButton
                              text="Add"
                              iconProps={{ iconName: "Add" }}
                              onClick={() =>
                                push({ name: "", description: "", amount: 0 })
                              }
                              styles={{ root: { width: 10, borderRadius: 4 } }}
                            />
                          </>
                        )}
                      </FieldArray>
                    </Stack>

                    <Stack styles={{ root: { alignSelf: "end" } }}>
                      <TextField value={`£ ${subtotal.toFixed(2)}`} disabled />
                    </Stack>
                    <Stack
                      horizontal
                      tokens={{ childrenGap: 10 }}
                      styles={{ root: { alignSelf: "end" } }}
                    >
                      <Label>VAT %</Label>
                      <TextField
                        name="vatPercentage"
                        type="number"
                        value={values.vatPercentage.toString()}
                        onChange={handleChange}
                      />
                    </Stack>
                    <Stack
                      horizontal
                      tokens={{ childrenGap: 10 }}
                      styles={{ root: { alignSelf: "end" } }}
                    >
                      <Label>VAT Amount</Label>
                      <TextField value={`£ ${vatAmount.toFixed(2)}`} disabled />
                    </Stack>
                    <Stack
                      horizontal
                      tokens={{ childrenGap: 10 }}
                      styles={{ root: { alignSelf: "end" } }}
                    >
                      <Label>Total Amount</Label>
                      <TextField value={`£ ${total.toFixed(2)}`} disabled />
                    </Stack>
                  </Stack>
                </Stack>

                {isLoading ? (
                  <Spinner
                    label="Adding Invoice..."
                    size={SpinnerSize.medium}
                  />
                ) : (
                  <Stack.Item
                    grow
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: 8,
                      position: "absolute",
                      bottom: "0px",
                      right: "0px",
                      padding: "10px",
                    }}
                  >
                    <DefaultButton text="Cancel" iconProps={{ iconName: "cancel" }} onClick={onDismiss} />
                    <PrimaryButton type="submit" text={"Save"} iconProps={{ iconName: "save" }}/>
                  </Stack.Item>
                )}
              </Form>
            </Stack>
          );
        }}
      </Formik>
    </Panel>
  );
}
