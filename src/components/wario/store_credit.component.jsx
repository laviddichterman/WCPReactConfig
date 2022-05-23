import StoreCreditIssueComponent from "./store_credit_issue.component";
import StoreCreditValidateAndSpendComponent from "./store_credit_validate_and_spend.component";

const StoreCreditComponent = ({ ENDPOINT }) => (
    <>
    <StoreCreditIssueComponent ENDPOINT={ENDPOINT} />
    <StoreCreditValidateAndSpendComponent ENDPOINT={ENDPOINT} />
    </>
  );

export default StoreCreditComponent;
