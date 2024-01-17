using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hlidacVystrah.Migrations
{
    /// <inheritdoc />
    public partial class eventurgency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "timestamp",
                table: "event_locality");

            migrationBuilder.AddColumn<string>(
                name: "text",
                table: "severity",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "img_path",
                table: "event_type",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "id_update",
                table: "event_locality",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "id_urgency",
                table: "event",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "text",
                table: "certainty",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "update",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    timestamp = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_update", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "urgency",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_urgency", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "update");

            migrationBuilder.DropTable(
                name: "urgency");

            migrationBuilder.DropColumn(
                name: "text",
                table: "severity");

            migrationBuilder.DropColumn(
                name: "img_path",
                table: "event_type");

            migrationBuilder.DropColumn(
                name: "id_update",
                table: "event_locality");

            migrationBuilder.DropColumn(
                name: "id_urgency",
                table: "event");

            migrationBuilder.DropColumn(
                name: "text",
                table: "certainty");

            migrationBuilder.AddColumn<string>(
                name: "timestamp",
                table: "event_locality",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
