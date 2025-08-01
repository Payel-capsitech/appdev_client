import React from "react";
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
  Text,
} from "@fluentui/react";
import { Formik, Form, FieldArray, FormikErrors } from "formik";
import * as Yup from "yup";
import useApi from "../../services/api";

interface EditInvoicePanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  invoice: any;
  onSuccess: () => void;
}

interface Service {
  name: string;
  description: string;
  amount: number;
}

interface InvoiceFormValues {
  services: Service[];
  vatPercentage: number;
  startDate?: Date;
  dueDate?: Date;
}

const InvoiceSchema = Yup.object().shape({
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

export default function EditInvoicePanel({
  isOpen,
  onDismiss,
  invoice,
  onSuccess,
}: EditInvoicePanelProps) {
  const api = useApi();
  if (!invoice) return null;

  const initialServices: Service[] = Array.isArray(invoice.service)
    ? invoice.service
    : [{ name: "", description: "", amount: 0 }];

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText={`Edit Invoice: ${invoice.invoiceId}`}
      type={PanelType.medium}
      isLightDismiss={false}
    >
      <Formik<InvoiceFormValues>
        initialValues={{
          services: initialServices,
          vatPercentage: invoice.vatPercentage,
          startDate: new Date(invoice.startDate),
          dueDate: new Date(invoice.dueDate),
        }}
        validationSchema={InvoiceSchema}
        onSubmit={async (values) => {
          const totalAmount = values.services.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
          );
          const payload = {
            service: values.services,
            amount: totalAmount,
            vatPercentage: values.vatPercentage,
            startDate: values.startDate?.toISOString(),
            dueDate: values.dueDate?.toISOString(),
          };

          try {
            await api.post(`/invoice/update/${invoice.id}`, payload);
            onSuccess();
            onDismiss();
          } catch (err: any) {
            console.error("Failed to update invoice:", err);
            alert(err.response?.data?.message || "Update failed");
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
            (sum, s) => sum + Number(s.amount || 0),
            0
          );
          const vatAmount =
            (subtotal * Number(values.vatPercentage || 0)) / 100;
          const total = subtotal + vatAmount;

          return (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 100px)",
              }}
            >
              <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
                <Stack tokens={{ childrenGap: 15 }}>
                  <TextField
                    label="Business Name"
                    value={invoice.businessName || ""}
                    disabled
                  />

                  <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <DatePicker
                      placeholder="Start Date"
                      value={values.startDate}
                      onSelectDate={(date) =>
                        setFieldValue("startDate", date ?? undefined)
                      }
                      onBlur={() => setFieldTouched("startDate", true)}
                      firstDayOfWeek={DayOfWeek.Sunday}
                      style={{ width: 200 }}
                    />
                    <div style={{ position: "absolute", marginTop: 30 }}>
                      {touched.startDate && errors.startDate && (
                        <Text variant="small" style={{ color: "brown" }}>
                          {errors.startDate}
                        </Text>
                      )}
                    </div>
                    <DatePicker
                      placeholder="Due Date"
                      value={values.dueDate}
                      onSelectDate={(date) =>
                        setFieldValue("dueDate", date ?? undefined)
                      }
                      onBlur={() => setFieldTouched("dueDate", true)}
                      firstDayOfWeek={DayOfWeek.Sunday}
                      style={{ width: 200 }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        marginTop: 30,
                        marginLeft: 210,
                      }}
                    >
                      {touched.dueDate && errors.dueDate && (
                        <Text variant="small" style={{ color: "brown" }}>
                          {errors.dueDate}
                        </Text>
                      )}
                    </div>
                  </Stack>

                  <Stack tokens={{ childrenGap: 10 }}>
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
                                placeholder="Service"
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
                                placeholder="Description"
                              />
                              <TextField
                                name={`services[${index}].amount`}
                                type="number"
                                value={service.amount?.toString() ?? ""}
                                onChange={(e, newValue) => {
                                  const amount =
                                    newValue === "" ? "" : Number(newValue);
                                  setFieldValue(
                                    `services[${index}].amount`,
                                    amount
                                  );
                                }}
                                styles={{
                                  root: { width: "30%" },
                                  field: { height: 32 },
                                }}
                                placeholder="Amount"
                                errorMessage={
                                  touched.services &&
                                  touched.services[index] &&
                                  errors.services &&
                                  (errors.services as FormikErrors<any>[])[
                                    index
                                  ]?.amount
                                }
                              />

                              <Stack style={{ width: "5%", marginTop: 4 }}>
                                {index > 0 && (
                                  <IconButton
                                    iconProps={{ iconName: "Delete" }}
                                    title="Remove"
                                    ariaLabel="Remove"
                                    onClick={() => remove(index)}
                                    styles={{ root: { width: 28, height: 28 } }}
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
                            styles={{
                              root: {
                                width: 100,
                                padding: "0 8px",
                                alignSelf: "start",
                              },
                            }}
                          />
                        </>
                      )}
                    </FieldArray>
                  </Stack>

                  <Stack
                    tokens={{ childrenGap: 10 }}
                    styles={{ root: { width: 250, alignSelf: "end" } }}
                  >
                    <TextField
                      label="Amount"
                      value={subtotal.toFixed(2)}
                      readOnly
                    />
                    <TextField
                      label="VAT %"
                      name="vatPercentage"
                      type="number"
                      value={values.vatPercentage.toString()}
                      onChange={handleChange}
                    />
                    <TextField
                      label="VAT Amount"
                      value={vatAmount.toFixed(2)}
                      readOnly
                    />
                    <TextField
                      label="Total"
                      value={total.toFixed(2)}
                      readOnly
                    />
                  </Stack>
                </Stack>
              </div>

              <div
                style={{
                  padding: "12px 0",
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <DefaultButton text="Cancel" onClick={onDismiss} />
                <PrimaryButton type="submit" text="Save" />
              </div>
            </Form>
          );
        }}
      </Formik>
    </Panel>
  );
}
