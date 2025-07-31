import React from "react";
import { Stack, Text, Label } from "@fluentui/react";

interface Address {
  country?: string;
  city?: string;
  postalCode?: string;
  building?: string;
  street?: string;
}

interface ProfileCardProps {
  business: {
    name: string;
    type: string;
    phoneNumber?: string;
    address: Address;
  };
  user: {
    username: string;
    email: string;
    createdOn?: string;
  };
}

export default function ProfileCard({ business, user }: ProfileCardProps) {
  return (
    <Stack
      styles={{
        root: {
          borderRadius: 6,
          backgroundColor: "rgb(250, 249, 248)",
          border:"1px solid rgb(225, 223, 221)",
          boxSizing: "inherit",
          padding: 10,
          marginTop: 10,
          marginBottom:10,
          marginLeft: 15,
          marginRight: 30
        },
      }}
      tokens={{ childrenGap: 24 }}
    >
      <Label styles={{ root: { fontSize: 15,fontWeight:400, color: "rgb(96, 94, 92)", borderBottom: "1px solid rgb(237, 235, 233)"} }}>User Info</Label>
      <Stack horizontal tokens={{ childrenGap: 40 }}>
        <Stack>
          <Text styles={{ root: { fontSize:13 ,fontWeight: 400, color: "rgb(161, 159, 157)" ,display: "block", marginBottom: 5} }}>Username</Text>
          <Text styles={{ root: { fontSize: 12 ,fontWeight: 400, color: "rgb(50, 49, 48)" ,display: "inline"} }}>{user.username || "-"}</Text>
        </Stack>
        <Stack>
          <Text styles={{ root: { fontSize:13 ,fontWeight: 400, color: "rgb(161, 159, 157)" ,display: "block", marginBottom: 5} }}>Email</Text>
          <Text styles={{ root: { fontSize: 12 ,fontWeight: 400, color: "rgb(50, 49, 48)" ,display: "inline"} }}>{user.email || "-"}</Text>
        </Stack>
      </Stack>

      
      <Label styles={{ root: { fontSize: 15,fontWeight:400, color: "rgb(96, 94, 92)", borderBottom: "1px solid rgba(237, 235, 233, 1)"} }}>Business Info</Label>
      <Stack horizontal tokens={{ childrenGap: 40 }}>
        <Stack>
          <Text styles={{ root: { fontSize:13 ,fontWeight: 400, color: "rgb(161, 159, 157)" ,display: "block", marginBottom: 5} }}>Business Name</Text>
          <Text styles={{ root: { fontSize: 12 ,fontWeight: 400, color: "rgb(50, 49, 48)" ,display: "inline"} }}>{business.name || "-"}</Text>
        </Stack>
        <Stack>
          <Text styles={{ root: { fontSize:13 ,fontWeight: 400, color: "rgb(161, 159, 157)" ,display: "block", marginBottom: 5} }}>Type</Text>
          <Text styles={{ root: { fontSize: 12 ,fontWeight: 400, color: "rgb(50, 49, 48)" ,display: "inline"} }}>{business.type || "-"}</Text>
        </Stack>
        <Stack>
          <Text styles={{ root: { fontSize:13 ,fontWeight: 400, color: "rgb(161, 159, 157)" ,display: "block", marginBottom: 5} }}>Phone Number</Text>
          <Text styles={{ root: { fontSize: 12 ,fontWeight: 400, color: "rgb(50, 49, 48)" ,display: "inline"} }}>{business.phoneNumber || "-"}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}