import StoreCreditIssueComponent from "./store_credit_issue.component";
//import StoreCreditValidateAndSpendComponent from "./store_credit_validate_and_spend.component";

const StoreCreditComponent = ({ ENDPOINT }) => {
  return (
    <>
    <StoreCreditIssueComponent ENDPOINT={ENDPOINT}></StoreCreditIssueComponent>
    {/* <StoreCreditValidateAndSpendComponent ENDPOINT={ENDPOINT}></StoreCreditValidateAndSpendComponent> */}
    </>
  );
};

export default StoreCreditComponent;
