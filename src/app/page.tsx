import Image from 'next/image'
import styles from './page.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import QRCodeReader from "@/components/QRCodeReader";

export default function Home() {
  return (
    <div className="container">
        <QRCodeReader/>
    </div>
  )
}
