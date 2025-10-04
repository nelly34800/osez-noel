<?php
echo "<h1>Osez Noël 🎄 - Back-end PHP fonctionne ✅</h1>";
echo "<p>Version PHP : " . phpversion() . "</p>";

// Test de connexion à MySQL
$host = getenv('MYSQL_HOST');
$db   = getenv('MYSQL_DATABASE');
$user = getenv('MYSQL_USER');
$pass = getenv('MYSQL_PASSWORD');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    echo "<p>Connexion MySQL réussie ✅</p>";
} catch (PDOException $e) {
    echo "<p style='color:red;'>Erreur MySQL ❌ : " . $e->getMessage() . "</p>";
}
?>
