import LegalPolicy from "../../modules/LegalPolicy/LegalPolicy";  

import privacyData from "../../shared/data/privacyData.js";

const PrivacyPolicyPage = () => {
    return (
        <div>
            <LegalPolicy  data={privacyData}/>
        </div>
    )
}

export default PrivacyPolicyPage;