import styles from "./LegalPolicy.module.css"


const LegalPolicy = ({ data }) => {
    return (
        <section className={styles.articleWrap}>
            <div className={styles.contentBox}>
                <h2 className={styles.headline}>{data.title}</h2>
                <p className={styles.publishedOn}>{data.date}</p>
                {data.sections.map((section, index) => (
                    <div key={index} className={styles.contentSection}>
                        <h4>{section.heading}</h4>
                        <p>{section.content}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default LegalPolicy;