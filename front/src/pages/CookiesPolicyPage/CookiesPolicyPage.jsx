import LegalPolicy from "../../modules/LegalPolicy/LegalPolicy";
import cookiesData from "../../shared/data/cookiesData"

const CookiesPolicyPage = () => {
    return (
        <main>
            <LegalPolicy data={cookiesData} />
        </main>
    )
}

export default CookiesPolicyPage;