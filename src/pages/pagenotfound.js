import React from 'react'
import {Link} from "react-router-dom";

function pagenotfound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <h1>Try THis Link :<Link to = "/">Home Page</Link></h1>
      <footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Barca Book. All rights reserved.</p>
  </div>
</footer>
    </div>
  )
}

export default pagenotfound ;
