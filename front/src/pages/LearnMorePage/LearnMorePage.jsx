import faqData from "../../shared/data/faqData";
import styles from "./LearnMorePage.module.css";

function LearnMorePage() {
  const { title, sections = [] } = faqData || {};

  return (
    <main>
      <div className={styles.banner}>
        <div className={styles.learnWrapper}>
          <h2 className={styles.learnTitle}>{title || "FAQ"}</h2>

          <div className={styles.learnContent}>
            {sections.map(({ question, answer }, idx) => (
              <div key={`${idx}-${question}`}>
                <h4>{question}</h4>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default LearnMorePage;