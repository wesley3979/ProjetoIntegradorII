import { Pages } from "../routes/Pages"
import { Row, Col } from "react-bootstrap"

export const Layout = () => {
  return (
    <main style={{padding: "20px 0px"}}>
      <Row>
        <Col md={{ span:10, offset: 1 }}>
          <Pages /> 
        </Col>
      </Row>
    </main>
  )
}