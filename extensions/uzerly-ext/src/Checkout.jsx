import {
  reactExtension, useApi,
  useSubscription
} from "@shopify/ui-extensions-react/checkout";
import { useEffect } from "react";


/* const orderDetailsBlock = reactExtension("purchase.checkout.footer.render-after", () => <OrderContent />);
export { orderDetailsBlock }; */

const thankYouBlock = reactExtension("purchase.thank-you.block.render", () => <Attribution />);
export { thankYouBlock };

function Attribution() {
  const {orderConfirmation,settings} = useApi();

  const {order} = useSubscription(orderConfirmation);
  const AllSettings = useSubscription(settings);

  console.log('settings', AllSettings)

  const orderId = order?.id?.split("/").pop();

  // order and transaction details
  console.log('order id ======xxxxxxxxx', orderId);

  useEffect(() => {
    if (orderId) {
      fetch(`https://2255.userly.net/tcl.js?transactionid=${orderId}`)
     }
    }, [orderId]);


  return (
    <></>
  );
}
/*
function OrderContent(){

  const order = useOrder()
  console.log(order)
  return (
    <></>
  )
}


function Survey({
  title,
  description,
  onSubmit,
  children,
  loading,
}) {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    await onSubmit();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View border="base" padding="base" borderRadius="base">
        <BlockStack>
          <Heading>Thanks for your feedback!</Heading>
          <Text>Your response has been submitted</Text>
        </BlockStack>
      </View>
    );
  }

  return (
    <View border="base" padding="base" borderRadius="base">
      <BlockStack>
        <Heading>{title}</Heading>
        <Text>{description}</Text>
        {children}
        <Button kind="secondary" onPress={handleSubmit} loading={loading}>
          Submit feedback
        </Button>
      </BlockStack>
    </View>
  );
}

function useStorageState(key) {
  const storage = useStorage();
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function queryStorage() {
      const value = await storage.read(key)
      setData(value);
      setLoading(false)
    }

    queryStorage();
  }, [setData, setLoading, storage, key])

  const setStorage = useCallback((value) => {
    storage.write(key, value)
  }, [storage, key])

  return [{data, loading}, setStorage]
}
 */
