<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251114175513 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE calendar (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, settings JSON NOT NULL, days JSON NOT NULL, created_at DATETIME NOT NULL, user_id INT NOT NULL, UNIQUE INDEX UNIQ_6EA9A146989D9B62 (slug), INDEX IDX_6EA9A146A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE shared_calendar (id INT AUTO_INCREMENT NOT NULL, shared_with_email VARCHAR(255) NOT NULL, token VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, calendar_id INT NOT NULL, UNIQUE INDEX UNIQ_3B8D50653FE78D04 (shared_with_email), INDEX IDX_3B8D5065A40A2C8 (calendar_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, role JSON NOT NULL, is_blocked TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE calendar ADD CONSTRAINT FK_6EA9A146A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE shared_calendar ADD CONSTRAINT FK_3B8D5065A40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE calendar DROP FOREIGN KEY FK_6EA9A146A76ED395');
        $this->addSql('ALTER TABLE shared_calendar DROP FOREIGN KEY FK_3B8D5065A40A2C8');
        $this->addSql('DROP TABLE calendar');
        $this->addSql('DROP TABLE shared_calendar');
        $this->addSql('DROP TABLE user');
    }
}
