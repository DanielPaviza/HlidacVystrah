using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hlidacVystrah.Migrations
{
    /// <inheritdoc />
    public partial class usernotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "notification",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_event_type = table.Column<int>(type: "int", nullable: false),
                    id_severity = table.Column<int>(type: "int", nullable: false),
                    id_certainty = table.Column<int>(type: "int", nullable: false),
                    id_area = table.Column<int>(type: "int", nullable: false),
                    isRegion = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user_notification",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_user = table.Column<int>(type: "int", nullable: false),
                    id_notification = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_notification", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notification");

            migrationBuilder.DropTable(
                name: "user_notification");
        }
    }
}
