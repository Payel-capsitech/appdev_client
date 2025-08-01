import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  Stack,
  Pivot,
  PivotItem,
  Text,
  mergeStyleSets,
  Persona,
  PersonaSize,
} from "@fluentui/react";
// import API from "../../../services/api";
import useApi from "../../../services/api";
import ProfileCard from "./ProfileCard";
import History from "./History";
import Billing from "../../invoice/Billing";
import EditInvoicePanel from "../../invoice/EditInvoicePanel";

interface Address {
  country?: string;
  city?: string;
  postalcode?: string;
  building: string;
  street?: string;
}

interface Business {
  username: string;
  email: string;
  createdOn: string;
  name: string;
  type: string;
  phoneNumber?: string;
  businessCode?: string;
  address: Address;
}

const useStyles = mergeStyleSets({
  header: { paddingBottom: 12, borderBottom: "1px solid #ddd", marginBottom: 16 },
  stack: { gap: 4 , marginLeft:10,marginTop:8 },
  businessName: { fontSize: 20, fontWeight: 400 ,marginTop: 4,color:"rgb(50, 49, 48)",display: "inline"},
  businessCode: { fontSize: 12, color: "#666", marginTop: 4 },
});

export default function BusinessDetails() {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [refreshInvoices, setRefreshInvoices] = useState(false);
  const [selectedInvoice] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const styles = useStyles;
  const api = useApi();

  useEffect(() => {
    api.get(`/business/${businessId}`)
      .then((res) => {
        setBusiness(res.data)
      })
      .catch((err) => console.error(err));
  }, [businessId]);

  const handleRefresh = () => setRefreshInvoices((prev) => !prev);
  const { user } = useOutletContext<{
    user: { username: string; email: string; id: string; role: string } | null;
  }>();

  return (
    <Stack styles={{ root: { padding: 0, margin: 0 } }}>
      {business && (
        <>
          <Stack className={styles.header}>
            <Stack horizontal verticalAlign="center" className={styles.stack} tokens={{ childrenGap: 12 }}>
              <Stack horizontal verticalAlign="center" style={{marginTop: 6}} >
                <Persona
                text={business.name}
                size={PersonaSize.size48}
                hidePersonaDetails
                className={styles.stack}
              />
              </Stack>
              <Stack>
                <Text variant="medium" styles={{ root: styles.businessName }}>
                  {business.name}
                </Text>
                <Text variant="small" styles={{ root: styles.businessCode }}>
                  Limited - {business.businessCode || "N/A"}
                </Text>
              </Stack>
            </Stack>
          </Stack>

          <Pivot aria-label="Business Tabs">
            <PivotItem headerText="Profile">
              <ProfileCard
                business={business}
                user={{
                  username: user?.username || "-",
                  email: user?.email || "-",
                }}
              />
            </PivotItem>

            <PivotItem headerText="History">
              <History businessId={businessId!} refresh={refreshInvoices} />
            </PivotItem>

            
            <PivotItem headerText="Billing">
              <Billing
                businessId={businessId!}
                businessName={business.name}
                businessAddress={business.address}
              />
              <EditInvoicePanel
                isOpen={isEditOpen}
                onDismiss={() => setIsEditOpen(false)}
                invoice={selectedInvoice}
                onSuccess={handleRefresh}
              />
            </PivotItem>
          </Pivot>
        </>
      )}
    </Stack>
  );
}
