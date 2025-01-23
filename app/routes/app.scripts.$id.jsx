// app/routes/app.scripts.new.jsx
import { redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import {
  Form,
  FormLayout,
  TextField,
  Select,
  Button,
  Page,
  Layout,
  Card
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
//import { createScript } from "../../models/Script.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const scriptData = {
    src: formData.get("src"),
    event: formData.get("event"),
    display_scope: formData.get("display_scope")
  };

  //await createScript(admin.session.shop, admin, scriptData);
  return redirect("/app");
}

export default function NewScript() {
  const submit = useSubmit();

  const handleSubmit = (formData) => {
    submit(formData, { method: "POST" });
  };

  return (
    <Page
      title="Add New Script"
      backAction={{ content: "Scripts", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Script URL"
                  type="url"
                  name="src"
                  required
                  helpText="The URL of your JavaScript file"
                />
                <Select
                  label="Event"
                  name="event"
                  options={[
                    { label: "On Load", value: "onload" },
                    { label: "On Page Load", value: "onpageload" }
                  ]}
                  defaultValue="onload"
                />
                <Select
                  label="Display Scope"
                  name="display_scope"
                  options={[
                    { label: "Online Store", value: "online_store" },
                    { label: "Order Status", value: "order_status" },
                    { label: "All", value: "all" }
                  ]}
                  defaultValue="online_store"
                />
                <Button submit primary>Add Script</Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
