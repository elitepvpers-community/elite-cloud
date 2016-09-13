<?php

class Userscript extends DBObject
{

    public $id;
    public $name;
    public $description;
    public $author;
    protected $script;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public static function create($name, $author, $script = '')
    {
        $stmt = Database::getInstance()->prepare('
			insert into user
			(name, author, script)
			values (:name, :author, :script)
		');
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':author', $author);
        $stmt->bindParam(':script', base64_encode($script));
        $stmt->execute();
        return new self(Database::getInstance()->lastID());
    }

    public function getID()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function getScript()
    {
        return base64_decode($this->script);
    }

    public function delete()
    {
        $stmt = Database::getInstance()->prepare('
			delete from userscript
			where id = :id
		');
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }

    public function update()
    {
        $stmt = Database::getInstance()->prepare('
			select *
			from userscript, user
			where userscript.id = :id
			  and user.id = userscript.id
		');
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        $ret = $stmt->fetch();
        if (!$this->consume($ret)) {
            return false;
        }
        $this->author = User::fromData($ret);
        return true;
    }

    public function save()
    {
        $stmt = Database::getInstance()->prepare('
			update userscript
			set name = :name
			set description = :description
			set author = :author
			set script = :script
			where id = :id
		');
        $stmt->bindParam(':name', $this->id);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':author', $this->author->getID());
        $stmt->bindParam(':script', $this->script);
        return $stmt->execute();
    }
}