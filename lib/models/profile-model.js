import OrderModel from "@/lib/models/order-model";
import SiteModel from "./site-model";
export default class ProfileModel {
  constructor(data) {
    const profile = data.attributes || data;
    this.id = data?.id;
    this.name = profile?.name;
    this.email = profile?.email;
    this.createdAt = profile?.createdAt;
    this.updatedAt = profile?.updatedAt;
    this.companyType = profile?.company_type;
    this.site = profile?.site?.data ? new SiteModel(profile?.site?.data) : null;
    this.canViewSecretData = profile?.can_view_secret_data;
    this.orders = profile.orders?.data
      ? profile.orders?.data.map((order) => new OrderModel(order))
      : null;
  }
}
