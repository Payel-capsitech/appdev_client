import React from "react";

interface ProfileCardProps {
  business: {
    name: string;
    type: string;
    phoneNumber: string;
    createdOn: string;
    address: {
      country?: string;
      city?: string;
      postalCode?: string;
      building?: string;
      street?: string;
    };
  };
}

export default function ProfileCard({ business }: ProfileCardProps) {
  return (
    <div className="border p-4 rounded bg-white shadow">
      <h3 className="font-bold text-lg mb-2">{business.name}</h3>
      <p>Type: {business.type}</p>
      <p>Phone: {business.phoneNumber}</p>
      <p>Created On: {new Date(business.createdOn).toLocaleDateString()}</p>
      <p>Country: {business.address.country || "N/A"}</p>
      <p>City: {business.address.city || "N/A"}</p>
      <p>Postal Code: {business.address.postalCode || "N/A"}</p>
      <p>Building: {business.address.building || "N/A"}</p>
      <p>Street: {business.address.street || "N/A"}</p>
    </div>
  );
}
