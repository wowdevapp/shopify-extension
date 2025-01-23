import { useNavigate, useSubmit } from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  TextField,
  Button,
  Form
} from "@shopify/polaris";

export async function action({ request }) {
  const formData = await request.formData();
  console.log("Submitted data:", {
    offerId: formData.get("offerId"),
    advertiserId: formData.get("advertiserId")
  });
  return null;
}

export default function Index() {
  const navigate = useNavigate();
  const submit = useSubmit();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    submit(form, { method: "POST" });
  };

  return (
    <Page title="Add Offer Details">
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <TextField
                  label="Offer ID"
                  name="offerId"
                  type="text"
                  required
                  autoComplete="off"
                />

                <TextField
                  label="Advertiser ID"
                  name="advertiserId"
                  type="text"
                  required
                  autoComplete="off"
                />

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => navigate("/")} variant="plain">
                    Cancel
                  </Button>
                  <Button submit primary>
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
