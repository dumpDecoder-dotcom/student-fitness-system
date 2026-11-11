&#x20;  # Student Fitness Assessment System



&#x20;  A Django web app where students record pre-test and post-test fitness results and track their progress, with separate student and teacher interfaces.



&#x20;  ## Features

&#x20;  - Student sign-up and login with password rules and duplicate account checks

&#x20;  - Pre-test and post-test forms (BMI, VO2 max, flexibility, strength, agility, speed, endurance)

&#x20;  - Server-side validation of all test inputs

&#x20;  - Student dashboard comparing pre-test and post-test results

&#x20;  - Teacher dashboard and class analytics interface (Chart.js)



&#x20;  ## Tech Stack

&#x20;  Python, Django, SQLite, HTML, CSS, JavaScript, Bootstrap, Chart.js



&#x20;  ## My Role

&#x20;  Project Leader



&#x20;  ## Known Limitations

&#x20;  - The teacher dashboard and class analytics pages are prototypes with sample data, not live database results.

&#x20;  - Passwords are hashed with MD5, which is not secure. Django's built-in password hashing should replace it before any real use.

&#x20;  - Intended for local development only (`DEBUG = True`).



&#x20;  ## Running Locally

&#x20;  1. Install Python 3.10 or newer.

&#x20;  2. Create a virtual environment and install requirements:

&#x20;     ```

&#x20;     python -m venv .venv

&#x20;     .venv\\Scripts\\activate

&#x20;     pip install -r requirements.txt

&#x20;     ```

&#x20;  3. Create the database and start the server:

&#x20;     ```

&#x20;     python manage.py migrate

&#x20;     python manage.py runserver

&#x20;     ```

&#x20;  4. Open http://127.0.0.1:8000/ in your browser.

