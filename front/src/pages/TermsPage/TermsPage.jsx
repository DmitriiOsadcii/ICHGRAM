import LegalPolicy from "../../modules/LegalPolicy/LegalPolicy";
import {termsData} from "../../shared/data/termsData";

const TermsPage = () => {
    return (
        <div>
            <LegalPolicy data={termsData} />
        </div>
    )
}

export default TermsPage;